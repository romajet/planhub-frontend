import { useState } from 'react';
import {
  Layout,
  Tree,
  Typography,
  Button,
  Input,
  Space,
  Divider,
  message,
  Tag,
  Modal,
  Form,
  Select,
} from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface KbNode extends DataNode {
  isFolder?: boolean;
  children?: KbNode[];
}

const initialTreeData: KbNode[] = [
  {
    title: 'Регламенты компании',
    key: '0-0',
    icon: <FolderOutlined />,
    isFolder: true,
    children: [
      { title: 'Правила оформления', key: 'doc-1', icon: <FileTextOutlined />, isLeaf: true },
      { title: 'Политика безопасности', key: 'doc-2', icon: <FileTextOutlined />, isLeaf: true },
    ],
  },
  {
    title: 'Проект: CRM',
    key: '0-1',
    icon: <FolderOutlined />,
    isFolder: true,
    children: [
      { title: 'Техническое задание', key: 'doc-3', icon: <FileTextOutlined />, isLeaf: true },
    ],
  },
];

const mockDocumentsDetail: Record<string, { title: string; content: string; lastUpdated: string }> =
  {
    'doc-1': {
      title: 'Правила оформления',
      content: 'Текст регламента...',
      lastUpdated: '10.03.2026',
    },
    'doc-2': {
      title: 'Политика безопасности',
      content: 'Политика ИБ...',
      lastUpdated: '11.03.2026',
    },
    'doc-3': {
      title: 'Техническое задание',
      content: 'Описание API и БД...',
      lastUpdated: '12.03.2026',
    },
  };

export const KnowledgeBase = () => {
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>('doc-3');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [treeData, setTreeData] = useState(initialTreeData);

  // Состояния для создания нового узла
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addParentKey, setAddParentKey] = useState<React.Key | null>(null);
  const [addForm] = Form.useForm();

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.isLeaf && selectedKeys.length > 0) {
      setSelectedDocKey(selectedKeys[0] as string);
      setIsEditing(false);
    }
  };

  const handleAddRoot = () => {
    setAddParentKey(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubPage = (e: React.MouseEvent, nodeKey: React.Key) => {
    e.stopPropagation();
    setAddParentKey(nodeKey);
    setIsAddModalOpen(true);
  };

  const handleSaveNewDoc = (values: any) => {
    const newKey = `doc-${Date.now()}`;
    const newNode: KbNode = {
      key: newKey,
      title: values.title,
      icon: values.type === 'folder' ? <FolderOutlined /> : <FileTextOutlined />,
      isFolder: values.type === 'folder',
      isLeaf: values.type !== 'folder',
    };

    if (addParentKey) {
      // Рекурсивное добавление в нужную папку
      const updateTree = (nodes: KbNode[]): KbNode[] => {
        return nodes.map((node) => {
          if (node.key === addParentKey) {
            return { ...node, children: [...(node.children || []), newNode] };
          }
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });
      };
      setTreeData(updateTree(treeData));
    } else {
      // Добавление в корень
      setTreeData([...treeData, newNode]);
    }

    // Если создали файл, добавляем для него пустой контент в базу
    if (values.type === 'file') {
      mockDocumentsDetail[newKey] = {
        title: values.title,
        content: 'Новый документ. Нажмите "Редактировать", чтобы добавить текст.',
        lastUpdated: new Date().toLocaleDateString('ru-RU'),
      };
    }

    message.success('Успешно добавлено!');
    setIsAddModalOpen(false);
    addForm.resetFields();
  };

  const titleRender = (nodeData: any) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingRight: 8,
        }}
      >
        <span>{nodeData.title}</span>
        {nodeData.isFolder && (
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />}
            onClick={(e) => handleAddSubPage(e, nodeData.key)}
            style={{ padding: 0, height: 20, width: 20 }}
          />
        )}
      </div>
    );
  };

  const handleEdit = () => {
    if (selectedDocKey && mockDocumentsDetail[selectedDocKey]) {
      setEditContent(mockDocumentsDetail[selectedDocKey].content);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedDocKey && mockDocumentsDetail[selectedDocKey]) {
      mockDocumentsDetail[selectedDocKey].content = editContent;
      mockDocumentsDetail[selectedDocKey].lastUpdated = new Date().toLocaleDateString('ru-RU');
    }
    setIsEditing(false);
    message.success('Документ успешно сохранен!');
  };

  const activeDoc = selectedDocKey ? mockDocumentsDetail[selectedDocKey] : null;

  return (
    <Layout
      style={{
        background: '#fff',
        minHeight: '75vh',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
      }}
    >
      <Sider
        width={320}
        style={{ background: '#fafafa', borderRight: '1px solid #f0f0f0', padding: '16px 0' }}
      >
        <div
          style={{
            padding: '0 16px',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text strong>Каталог документов</Text>
          <Button type="text" icon={<PlusOutlined />} size="small" onClick={handleAddRoot} />
        </div>
        <Tree
          showIcon
          blockNode
          defaultExpandAll
          selectedKeys={selectedDocKey ? [selectedDocKey] : []}
          treeData={treeData}
          onSelect={onSelect}
          titleRender={titleRender}
        />
      </Sider>

      <Content style={{ padding: '24px 32px' }}>
        {activeDoc ? (
          <div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {activeDoc.title}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag color="blue">Опубликовано</Tag>
                  <Text type="secondary">Обновлено: {activeDoc.lastUpdated}</Text>
                </Space>
              </div>
              {!isEditing ? (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  Редактировать
                </Button>
              ) : (
                <Space>
                  <Button onClick={() => setIsEditing(false)}>Отмена</Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    Сохранить
                  </Button>
                </Space>
              )}
            </div>
            <Divider />
            <div style={{ minHeight: 400 }}>
              {!isEditing ? (
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {activeDoc.content}
                </Paragraph>
              ) : (
                <TextArea
                  autoSize={{ minRows: 15 }}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ fontSize: 16, lineHeight: 1.8 }}
                />
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Space direction="vertical" align="center">
              <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
              <Text type="secondary">Выберите документ в меню слева для просмотра</Text>
            </Space>
          </div>
        )}
      </Content>

      {/* МОДАЛКА ДОБАВЛЕНИЯ ПАПКИ/ФАЙЛА */}
      <Modal
        title={addParentKey ? 'Создать вложенную страницу' : 'Создать корневой раздел'}
        open={isAddModalOpen}
        onOk={() => addForm.submit()}
        onCancel={() => {
          setIsAddModalOpen(false);
          addForm.resetFields();
        }}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleSaveNewDoc}
          initialValues={{ type: 'file' }}
        >
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input placeholder="Например: Инструкция по деплою" />
          </Form.Item>
          <Form.Item name="type" label="Тип элемента">
            <Select>
              <Select.Option value="file">📄 Текстовый документ</Select.Option>
              <Select.Option value="folder">📁 Папка (Категория)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
