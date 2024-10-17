from flask import Flask, jsonify, request
import boto3
from botocore.exceptions import ClientError

app = Flask(__name__)

# Configuração do DynamoDB (AWS)
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('TasksTable')  # Tabela DynamoDB para armazenar tarefas

# Função para listar todas as tarefas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        response = table.scan()
        tasks = response.get('Items', [])
        return jsonify(tasks)
    except ClientError as e:
        return jsonify({'error': str(e)}), 500

# Função para adicionar uma nova tarefa
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task_id = data.get('task_id')
    title = data.get('title')
    description = data.get('description')

    try:
        table.put_item(
            Item={
                'task_id': task_id,
                'title': title,
                'description': description,
                'completed': False
            }
        )
        return jsonify({'message': 'Tarefa adicionada com sucesso!'}), 201
    except ClientError as e:
        return jsonify({'error': str(e)}), 500

# Função para marcar uma tarefa como concluída
@app.route('/tasks/<task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    try:
        response = table.update_item(
            Key={'task_id': task_id},
            UpdateExpression="set completed = :c",
            ExpressionAttributeValues={':c': True},
            ReturnValues="UPDATED_NEW"
        )
        # Simulação de envio de notificação usando a API Node.js
        requests.post('http://localhost:3002/notify', json={'task_id': task_id})
        return jsonify({'message': 'Tarefa concluída!', 'task': response['Attributes']})
    except ClientError as e:
        return jsonify({'error': str(e)}), 500

# Função para excluir uma tarefa
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        table.delete_item(Key={'task_id': task_id})
        return jsonify({'message': 'Tarefa removida com sucesso!'}), 200
    except ClientError as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
