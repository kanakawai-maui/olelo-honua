# OpenRouter

OpenRouter is a powerful tool that simplifies the integration of AI models into your applications. 
It provides a unified API for accessing multiple AI models, enabling developers to seamlessly switch 
between models or combine their capabilities. With its robust infrastructure, OpenRouter ensures 
scalability, reliability, and ease of use, making it an excellent choice for building intelligent 
applications.

## Setting Up OpenRouter and Obtaining an OpenRouter API Key

Follow these steps to set up an OpenRouter account and get your API key:

## 1. Create an OpenRouter Account
1. Visit [OpenRouter](https://openrouter.ai).
2. Sign up for an account if you don’t already have one.

## 2. Generate an API Key
1. After logging in, navigate to the **API Keys** section in your account settings.
2. Click **Create API Key**.
3. Provide a name for your key (e.g., "My Project Key").
4. Optionally, set a credit limit for the key.
5. Save the key securely. **You won’t be able to view it again later.**
## 3. Use the API Key

It is recommended to store your API key in a local `.env` file to keep it secure and prevent accidental exposure. Ensure the `.env` file is added to your `.gitignore` to avoid committing it to version control.

### Example `.env` File
```
OPENROUTER_API_KEY=your-api-key-here
```

### Accessing the API Key in Your Code
Use a library like `dotenv` to load the `.env` file and access the API key in your application.
