from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import ollama

app = Flask(__name__)

# Initialize CORS to allow all origins
CORS(app)

# Route to interact with the Ollama Gemma2 model and stream the response
@app.route('/chat', methods=['POST'])
def chat():
    # Get user input from the JSON request body
    data = request.get_json()

    print(type(data))
    
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Message field is required'}), 400

    user_message = data['message']

    # Stream the response from Ollama
    def generate_response():
        stream = ollama.chat(
            model='gemma2:2b',
            messages=[{'role': 'user', 'content': user_message}],
            stream=True,
        )
        for chunk in stream:
            yield chunk['message']['content']

    # Return the response as a streaming content
    return Response(generate_response(), content_type='text/plain')

if __name__ == '__main__':
    app.run(debug=True,port=8000)
