# Text to Image Generator with MagicAPI

This project is a Next.js application that allows users to generate images based on text prompts using the [Text To Image API](https://api.market/store/bridgeml/text-to-image) from MagicAPI's marketplace. The application features a clean UI for inputting text prompts, displays generated images, and logs all requests. Users can view logs, including the status and generation time of each request, and download generated images.

## Table of Contents

- [Features](#features)
- [Project Setup](#project-setup)
- [Running the Project](#running-the-project)
- [API Usage](#api-usage)
- [Links](https://magic-api-eight.vercel.app/)

## Features

- **Image Generation**: Input a text prompt to generate an image using MagicAPI.
- **Logging**: View a history of all generated images with the associated prompts, status, and generation time.
- **Download Images**: Download the generated images directly from the application.
- **Persistent Logs**: Logs are stored in `localStorage` and automatically cleared when the browser tab is closed.
- **Clear Logs**: Manually clear all logs from the logs page.

## Project Setup

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v14 or later): [Download and Install Node.js](https://nodejs.org/)
- **npm** (v6 or later): Comes with Node.js. Verify it with the command:

### Installation

1.  Clone the Repository
2.  Navigate to the Project Directory
    ```bash
    cd [project_name]
    ```
3.  Install Dependencies
    ```bash
    npm install
    ```

## Environment Variables

1. Create a .env.local File

   In the root directory of your project, create a .env.local file.

2. Add Your API Key

   Add your MagicAPI key to the .env.local file:

   ```bash
   API_KEY=your_magicapi_key_here

   ```

   Replace your_magicapi_key_here with your actual API key from MagicAPI.

# Running the Project

## Development Server

To run the project locally in development mode, use the following command:

```bash
npm run dev

```

# API Usage

## This application uses the MagicAPI "Text To Image API" to generate images based on user input. Below is an example of how to interact with the API:

### API Endpoint

- URL: https://api.magicapi.dev/api/v1/bridgeml/text-to-image/text-to-image
- Method: POST
- Headers:
- accept: application/json
- x-magicapi-key: YOUR_API_KEY
- Content-Type: application/json
- Request Body:
- prompt: The text prompt for generating the image.
- height: Height of the generated image.
- width: Width of the generated image.
- scheduler: Scheduler algorithm to use.
- num_outputs: Number of images to generate.
- guidance_scale: Guidance parameter for image generation.
- negative_prompt: Optional negative prompt to exclude certain details.
- num_inference_steps: Number of inference steps.

## Example Request

```bash

curl -X 'POST' \
  'https://api.magicapi.dev/api/v1/bridgeml/text-to-image/text-to-image' \
  -H 'accept: application/json' \
  -H 'x-magicapi-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
  "prompt": "Futuristic space battle, hyper realistic, 4k",
  "height": 512,
  "width": 512,
  "scheduler": "K_EULER",
  "num_outputs": 1,
  "guidance_scale": 0,
  "negative_prompt": "worst quality, low quality",
  "num_inference_steps": 4
}'


```

## Links

MagicAPI Marketplace: (https://api.market/store/bridgeml/text-to-image)
Next.js Documentation: (https://nextjs.org/docs)
Tailwind CSS Documentation: (https://tailwindcss.com/docs)
