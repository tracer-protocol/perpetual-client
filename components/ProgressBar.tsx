import React from 'react';
import Progress from 'antd/lib/progress';

interface IProps {
    percent: number;
}

const ProgressBar: React.FC<IProps> = ({ percent }: IProps) => {
    return <Progress percent={percent} strokeColor="#55D31D" />;
};

export default ProgressBar;
