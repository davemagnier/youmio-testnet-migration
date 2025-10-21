# TypeScript Types for Limbo Chatbot

This directory contains TypeScript interfaces that define the structure of data used in the Limbo Chatbot application.

## Chat Request Types

### ChatRequest
The main interface for the chat API request body, containing:
- `prompt`: User's input message
- `knowledge`: Knowledge base content (optional)
- `personality`: Personality configuration (optional)
- `behavior`: Behavior configuration (optional)
- `conversationHistory`: Previous conversation messages (optional)

### Personality
Defines the personality traits of the AI character:
- `backstory`: Character identity and background
- `traits`: Key personality characteristics
- `helpfulness`: Helpfulness level (0-100)
- `sarcasm`: Sarcasm level (0-100)
- `enthusiasm`: Enthusiasm level (0-100)
- `awareness`: Conversational awareness (0-100)

### Behavior
Defines behavioral parameters for the AI:
- `primaryRules`: Main interaction rules
- `responseExamples`: Examples of response patterns

### ConversationMessage
Represents a single message in the conversation history:
- `role`: Sender role ("user" or "assistant")
- `content`: Message content

### AdminSettings
Structure used in the frontend for admin configuration:
- `personality`: Personality configuration
- `knowledge`: Knowledge settings
- `behavior`: Behavior configuration
- `documents`: Array of uploaded documents

### Document
Represents an uploaded document:
- `name`: Document name
- `content`: Document content

### ImageRequest
Simple interface for image generation requests:
- `prompt`: Image generation prompt

## Usage

These types can be imported in your TypeScript files:

```typescript
import { ChatRequest, Personality, Behavior } from './types/chat-request';
```

## Benefits

1. **Type Safety**: Ensures data structures match expected formats
2. **Autocomplete**: Provides IDE autocomplete for object properties
3. **Documentation**: Clear documentation of expected data structures
4. **Error Prevention**: Catches type-related errors at compile time