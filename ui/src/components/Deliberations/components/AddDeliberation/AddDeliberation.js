import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FormGroup, Label, Input } from 'reactstrap';
import NormalizeUrl from 'normalize-url';
import ValidUrl from 'valid-url';

const ADD_REALITY_HAS_DELIBERATION = gql`
  mutation AddRealityHasDeliberation_addHasDeliberationMutation(
    $from: _RealityInput!
    $to: _InfoInput!
  ) {
    addRealityHasDeliberation(from: $from, to: $to) {
      from {
        nodeId
        deliberations {
          nodeId
          title
          url
        }
      }
    }
  }
`;

const InvalidUrlText = styled.span`
  color: #ff0000;
  font-weight: bold;
`;

class AddDeliberation extends React.Component {
  state = {
    inputValue: '',
    invalidUrl: false,
  };
  // normalizeUrl(url) {
  //  return NormalizeUrl(url);
  // }
  render() {
    const { nodeId } = this.props;
    return (
      <Mutation mutation={ADD_REALITY_HAS_DELIBERATION}>
        { addDeliberation => (
          <FormGroup>
            <Label for="editDeliberationUrl">
              Add a deliberation {this.state.invalidUrl && (
              <InvalidUrlText>
                Invalid URL!
              </InvalidUrlText>
            )}
            </Label>


            <Input
              placeholder="Enter full url"
              type="url"
              required
              id="editDeliberationUrl"
              value={this.state.inputValue}
              onKeyPress={(e) => {
                // Submit form if user hits Enter
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!this.state.inputValue.replace(/\s+/g, '')) { return; }

                  // TODO: URL normalization can be improved if we know the particular
                  // provider, e.g. loomio.com talk links have a specific format and we
                  // could (should) clip off extraneous http vars.  Therefore, this code
                  // might be better somewhere else.
                  // URLs should be sanitized on the backend, also, to avoid certain attacks.
                  try {
                    const validated = ValidUrl.isUri(this.state.inputValue);
                    this.setState({ inputValue: NormalizeUrl(validated, { stripHash: false }) });
                    this.setState({ invalidUrl: false });
                  } catch (err) {
                    console.log(err);
                    this.setState({ invalidUrl: true });
                    return;
                  }

                addDeliberation({
                  variables: {
                    from: { nodeId },
                    to: { url: this.state.inputValue },
                 },
                });
                this.setState({ inputValue: '' });
              }
              }}
              onChange={e => this.setState({ inputValue: e.target.value })}
            />
          </FormGroup>
        )}
      </Mutation>
    );
  }
}

AddDeliberation.propTypes = {
  nodeId: PropTypes.string,
};

AddDeliberation.defaultProps = {
  nodeId: '',
};

export default AddDeliberation;
