import { Divider, List, Spin, Typography, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { ReplayLogService } from '../../services/ReplayLogService';

type ReplayListProps = {
	onReplayClick: (replay: string) => void,
	onReturnToBase: () => void,
}

const ReplayList: React.FC<ReplayListProps> = ({
	onReplayClick,
	onReturnToBase,
}) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<string[]>([]);

	const loadReplays = async () => {
		const replays = await (new ReplayLogService()).getReplaysList();
		setData(replays);
		setLoading(false);
	}

	useEffect(() => {
		loadReplays();
	}, []);

	return (
		<>
			<Space direction='vertical' style={{ width: 800 }}>
				<Divider orientation="left">Default Size</Divider>
				{loading ? <Spin /> : <List
					header={<div>Replays</div>}
					bordered
					dataSource={data}
					renderItem={(item) => (
						<List.Item>
							<Typography.Text mark>{item}</Typography.Text>
							<Button onClick={() => onReplayClick(item)}>Play</Button>
						</List.Item>
					)}
				/>}
				<Button onClick={onReturnToBase} disabled={loading}>Return</Button>
			</Space>
		</>
	);
}
export default ReplayList;
