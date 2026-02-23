import BaseNode from './BaseNode'
function ConditionNode(props) {
  return <BaseNode {...props} type="condition" showYesNo={true} />
}
export default ConditionNode