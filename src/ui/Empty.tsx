type IProps = {
  resourceName: string;
};

function Empty({ resourceName }: IProps) {
  return <p>未找到 {resourceName}。</p>;
}

export default Empty;
