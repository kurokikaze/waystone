import { Alert, Divider, List, Spin, Typography, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { ReplayLogService } from '../../services/ReplayLogService';
import { ErrorDumpService } from '../../services/ErrorDumpService';

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
	const [error, setError] = useState<string>();

	const loadReplays = async () => {
		setLoading(true);
		setError(undefined);
		try {
			setData(await (new ReplayLogService()).getReplaysList());
		} catch (error) {
			setError(String(error instanceof Error ? error.message : error));
			void ErrorDumpService.dumpActionFailure({ type: 'replays/list' }, null, error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadReplays();
	}, []);

	return (
		<div className='appHolder'>
			<Space direction='vertical' style={{ width: 800 }}>
				<Divider orientation="left">Default Size</Divider>
				{error && <Alert type="error" message="Could not load replays" description={error} />}
				{loading ? <Spin /> : <List
					header={<div>Replays</div>}
					bordered
					dataSource={data}
					renderItem={(item) => (
						<List.Item>
							<Typography.Text>{item}</Typography.Text>
							<Button onClick={() => onReplayClick(item)}>Play</Button>
						</List.Item>
					)}
				/>}
				{error && <Button onClick={loadReplays} disabled={loading}>Retry</Button>}
				<Button onClick={onReturnToBase}>Return</Button>
			</Space>
		</div>
	);
}
export default ReplayList;
