import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToolOutlined } from '@ant-design/icons';

export const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}
    >
      <Result
        icon={<ToolOutlined style={{ color: '#1677ff' }} />}
        title="Раздел в разработке"
        subTitle="Эта функция будет доступна после интеграции с серверным API (FastAPI) в следующем релизе."
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Вернуться назад
          </Button>
        }
      />
    </div>
  );
};
