import { Button, Input, Space } from 'antd';
import React from 'react'

const SearchColumns = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        value={selectedKeys[0]}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          size="small"
          style={{ width: 90 }}
          onClick={() => confirm()}
        >
          البحث
        </Button>
        <Button
          size="small"
          style={{ width: 90 }}
          onClick={() => {
            clearFilters();
          }}
        >
          إعادة الضبط
        </Button>
      </Space>
    </div>
  );

export default SearchColumns
