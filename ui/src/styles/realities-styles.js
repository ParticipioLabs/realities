import { InputGroup, ListGroup, ListGroupItem, Card } from 'reactstrap';
import styled from 'styled-components';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';

const CircleButton = styled.button`
  background-color: transparent;
  border: none;
  padding-top: 0;
  padding-bottom: 0;
  &:focus {
    outline: none;
  }
`;

const RealitiesCircleOutline = styled(MdAddCircleOutline)`
  display: inline-block;
  font-size: 1.5em;
  color: rgba(255, 255, 255, 0.50);
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px transparent;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
  &:hover, &:focus {
    color: #fff;
  }
  &:hover {
    color: #fff;
    -webkit-transform: skew(-10deg);
    transform: skew(-10deg);
  }
}
`;

const CreateNeedInput = styled(InputGroup)`
  margin-bottom: 1em;
  .input-group-prepend {
    margin-right: -3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
 .input-group-text {
    padding: .375rem .75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    background-color: #00cf19;
    border: 1px solid #ced4da;
    border-radius: .25rem;
   }
`;
const CreateResponsibilityInput = styled(InputGroup)`
  margin-bottom: 1em;
  .input-group-prepend {
    margin-right: -3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
 .input-group-text {
    padding: .375rem .75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    background-color: #843cfd;
    border: 1px solid #ced4da;
    border-radius: .25rem;
   }
`;

const RealitiesListHeader = styled(Card)`
  font-size: 1.5em;
  padding: 0.5em 0.5em 0.5em 0.5em;
  flex-direction: row;
  justify-content: space-between;
  color: #fff;
  background-color: #999;
  margin-bottom: 0.5em;
`;

const RealitiesListGroup = styled(ListGroup)`
    margin-bottom: 1em;
`;

const RealitiesListGroupItem = styled(ListGroupItem)`
    outline: none;
`;

const NeedsListHeader = RealitiesListHeader.extend`
  background-color: #00cf19;
`;

const ResponsibilitiesListHeader = RealitiesListHeader.extend`
  background-color: #843cfd;
`;

const NeedsListGroupItem = RealitiesListGroupItem.extend`
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #00cf19;
    border-color: #00cf19;
    color: #fff;
  }
`;

const ResponsibilitiesListGroupItem = RealitiesListGroupItem.extend`
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #843cfd;
    border-color: #843cfd;
    color: #fff;
  }
`;

export {
  CircleButton,
  CreateNeedInput,
  CreateResponsibilityInput,
  NeedsListHeader,
  NeedsListGroupItem,
  ResponsibilitiesListHeader,
  ResponsibilitiesListGroupItem,
  RealitiesCircleOutline,
  RealitiesListGroup,
};
