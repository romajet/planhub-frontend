import { Typography, Card, Row, Col, Divider, Space } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

export const AdminSettings = () => {
  const CheckItem = ({ text, checked }: { text: string; checked: boolean }) => (
    <Space style={{ marginBottom: 12, display: 'flex' }}>
      {checked ? (
        <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
      ) : (
        <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
      )}
      <Text
        type={checked ? undefined : 'secondary'}
        style={{ textDecoration: checked ? 'none' : 'line-through' }}
      >
        {text}
      </Text>
    </Space>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Настройки системы
        </Title>
        <Text type="secondary">Глобальные параметры и справочник ролевой модели</Text>
      </div>

      <Card title="Роли и права доступа (RBAC Matrix)" variant="borderless">
        <Row gutter={[32, 32]}>
          <Col span={8}>
            <div
              style={{
                background: '#fafafa',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <Title level={4} style={{ color: '#1e3a5f', marginBottom: 20 }}>
                Администратор
              </Title>
              <CheckItem text="Полный доступ к системе" checked={true} />
              <CheckItem text="Управление портфелями проектов" checked={true} />
              <CheckItem text="Управление оргструктурой" checked={true} />
              <CheckItem text="Сводные отчеты по ROI" checked={true} />
              <Divider style={{ margin: '16px 0' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Имеет доступ ко всем данным компании без ограничений.
              </Text>
            </div>
          </Col>

          <Col span={8}>
            <div
              style={{
                background: '#fafafa',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <Title level={4} style={{ color: '#1e3a5f', marginBottom: 20 }}>
                Руководитель
              </Title>
              <CheckItem text="Доступ к своим проектам" checked={true} />
              <CheckItem text="Управление задачами (Drag&Drop)" checked={true} />
              <CheckItem text="Настройка прав внутри команды" checked={true} />
              <CheckItem text="Глобальное управление ролями" checked={false} />
              <Divider style={{ margin: '16px 0' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Управляет ресурсами только в рамках назначенных проектов.
              </Text>
            </div>
          </Col>

          <Col span={8}>
            <div
              style={{
                background: '#fafafa',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
              }}
            >
              <Title level={4} style={{ color: '#1e3a5f', marginBottom: 20 }}>
                Сотрудник / Разработчик
              </Title>
              <CheckItem text="Просмотр своих задач" checked={true} />
              <CheckItem text="Отправка отчетов о работе" checked={true} />
              <CheckItem text="Просмотр базы знаний" checked={true} />
              <CheckItem text="Управление бэклогом" checked={false} />
              <Divider style={{ margin: '16px 0' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Исполнитель. Видит только то, что назначено лично на него.
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
