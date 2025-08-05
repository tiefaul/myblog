---
layout: post
title: Building an AI Chatbot with Django, HTMX, and Langflow
date: 2025-08-05 11:00:00
description: Creating an AI Chatbot using Django
tags: ai python htmx langflow channels 
categories: django
---

I wanted to share a project I've been working on as part of my experimental Django website — an AI-powered chatbot that responds to questions using a collection of personal notes I’ve fed into it.

This app is an exciting combination of several tools and frameworks including:

- Django - the foundation of the application
- Django Channels - for managing real-time WebSocket communication
- HTMX - to handle dynamic front-end interactions without heavy JavaScript
- Langflow - for orchestrating and managing the AI workflow

Together, these tools made it possible to build what you see below:
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/msedge_DQzFZZjXZQ.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>

Below is a snippet from my consumer.py file, which handles the WebSocket connections between the frontend and the backend:

```python
import json
import requests
import os
from typing import Optional
from channels.db import database_sync_to_async
from ai_chatbot.models import AiConversationModel
from channels.generic.websocket import AsyncWebsocketConsumer
from django.template.loader import render_to_string
from asgiref.sync import sync_to_async



BASE_API_URL = "<API URL>" # Langflow server.
FLOW_ID = os.getenv("FLOW_ID") # Langflow flow id.
URL = f"{BASE_API_URL}/api/v1/run/{FLOW_ID}" # Endpoint url to run langflow.

"""
Create consumer for Async Websocket.
"""

class AiConversationConsumer(AsyncWebsocketConsumer):
    """
    Create async connect method.
    """

    async def connect(self):
        # Grab id and user information from the websocket scope.
        self.id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user = self.scope["user"] # Using self.user makes this variable available to other methods i.e disconnect method.
        if self.user.is_authenticated:
            print(f"{self.user} Connected.")
            await self.accept()
        else:
            await self.close()

    """
    Create async disconnect method.
    """
    
    async def disconnect(self, code):
        print(f"{self.user} Disconnected. Saving the conversation.")
        # Save conversation once user disconnects.
        await self.save_conversation(id=self.id, user=self.user, new_messages=self.conversation_json_messages)
        pass

    """
    Create async receive method.
    """
    
    async def receive(self, text_data):
        # Turn text_data(json) argument, sent from the client, into a dictionary.
        text_data_json = json.loads(text_data) 
        message = text_data_json["message"] # Name of your form value.
        self.conversation_json_messages = await self.get_conversation(id=self.id, user=self.user)

        # Append/save the text_data message to the AiConversationModel.conversation table.
        self.conversation_json_messages.append(
            {
                "role": "User",
                "message": message,
            }
        )

        # Turn user message into HTML and send to HTMX frontend. render_to_string will take the HTML template, convert it to a string, and send to HTMX. HTMX will then read the string as HTML.
        await self.send(
            text_data = render_to_string(template_name="ai_chatbot/websocket_templates/user_message.html", context={"user": self.user, "message": message})
        )

        """
        Create AI message.
        """
    
        ai_message = await self.run_flow(url=URL, message=message, langflow_api_key=os.getenv("LANGFLOW_API_KEY"))
        ai_parsed_message = ai_message["outputs"][0]["outputs"][0]["results"]["message"]["text"]
        
        # Sanitize the HTML.
        from html_sanitizer import Sanitizer
        sanitized_ai_parsed_message = Sanitizer().sanitize(ai_parsed_message)

        self.conversation_json_messages.append(
            {
                "role": "Ai",
                "message": sanitized_ai_parsed_message,
            }
        )

        # Turn Ai markdown message into html.
        import markdown
        ai_html_message = markdown.markdown(ai_parsed_message)

        await self.send(
            text_data = render_to_string(template_name="ai_chatbot/websocket_templates/ai_message.html", context={"ai_html_message": ai_html_message})
        )

        #---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#
        # Below is an alternative way to send the message not using the `render_to_string` method.
        # Essentially you are creating the html template and storing it in a variable 
        # and then sending it off to be received as json to the frontend HTMX

        # message_html = f"<div hx-swap-oob='beforeend:#ai-messages'><b>ChatBot:</b><p>{ai_html_message}</p></div>" # Be careful with your quotation marks. Inner HTML must be in single quotes.
        # await self.send(
        #     text_data = json.dumps(
        #         {
        #             "message": message_html,
        #         }
        #     )
        # )
        #---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------#

        # ------------------------------------------------------------------------------------------------------------ #
        # Below are notes on using a channel layer. Channel layers can be used to group
        # other consumer instances to talk with each other by using the channel_layer.group_add function 

        # Type key calls a function (chat.message = chat_message) and passes it to the event argument of the function.
        # await self.channel_layer.send(
        #     self.channel_name,
        #     {
        #         "type": "chat.message",
        #         "message": message,
        #         "username": self.user
        #     }
        # )
        # ------------------------------------------------------------------------------------------------------------ #

    """
    Create a sync_to_async function that takes an api call to your langflow api server.
    """

    @sync_to_async
    def run_flow(
        self,
        url: str,
        message: str,
        output_type: str = "chat", # Defaults to chat.
        input_type: str = "chat",
        langflow_api_key: Optional[str] = None
    ): # This all should output a dictionary (response.json()).
        try:
            # Supply json payload for api call.
            payload = {
                "input_value": message,
                "output_type": output_type,
                "input_type": input_type
            }
            # Supply headers for api call.
            headers = {
                "Content-Type": "application/json",
                "x-api-key": langflow_api_key
            }
            response = requests.post(url, json=payload, headers=headers)
            return response.json()
        
        except requests.JSONDecodeError as e:
            print(f"Error with json: {e}")


    """
    Create save and get conversation methods.
    """

    @database_sync_to_async
    def get_conversation(self, id, user):
        ai_conversation = AiConversationModel.objects.get(id=id, user=user)
        return ai_conversation.conversation if ai_conversation.conversation else []
    
    @database_sync_to_async
    def save_conversation(self, id, user, new_messages):
        ai_conversation = AiConversationModel.objects.get(id=id, user=user)
        ai_conversation.conversation = new_messages
        ai_conversation.save()
```

The consumer.py file plays a critical role in enabling real-time communication with the chatbot. It listens for messages from the frontend, processes them, and returns AI-Generated responses powered by Langflow.

Hopefully this post inspired someone to make something similar. I definitely learned a lot about WebSocket connections and how Async technology works, along with some HTMX elements.