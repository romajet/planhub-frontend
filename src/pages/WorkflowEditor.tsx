import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Typography, Space, message } from 'antd';
import { SaveOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Начальные блоки (статусы)
const initialNodes = [
  { id: '1', position: { x: 50, y: 150 }, data: { label: 'Новая (To Do)' }, type: 'input' },
  { id: '2', position: { x: 300, y: 150 }, data: { label: 'В работе (In Progress)' } },
  { id: '3', position: { x: 550, y: 150 }, data: { label: 'Ревью (Review)' } },
  { id: '4', position: { x: 800, y: 150 }, data: { label: 'Готово (Done)' }, type: 'output' },
];

// Начальные связи (стрелочки)
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

export const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Обработчик соединения блоков вручную
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  // Добавление нового кастомного статуса
  const handleAddNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      position: { x: 300, y: 250 }, // Появляется чуть ниже
      data: { label: `Новый статус ${newNodeId}` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleSave = () => {
    message.success('Шаблон бизнес-процесса успешно сохранен!');
    // Здесь мы отправим JSON с узлами и связями на наш FastAPI бэкенд
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Редактор Workflow
          </Title>
          <Text type="secondary">Настройка жизненного цикла задач для проектов</Text>
        </div>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAddNode}>
            Добавить статус
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Сохранить шаблон
          </Button>
        </Space>
      </div>

      {/* Обертка с жесткой высотой ОБЯЗАТЕЛЬНА для React Flow */}
      <div
        style={{
          height: '70vh',
          width: '100%',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          background: '#fff',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Background color="#ccc" gap={16} />
        </ReactFlow>
      </div>

      <div style={{ marginTop: 16 }}>
        <Space>
          <SettingOutlined style={{ color: 'gray' }} />
          <Text type="secondary">
            * Перетаскивайте блоки мышкой. Чтобы создать связь, потяните за кружочек на границе
            блока и соедините с другим.
          </Text>
        </Space>
      </div>
    </div>
  );
};
