import React from 'react';
// import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import styled from 'styled-components';

const Tags = styled.div`
  .ReactTags__selected {
    display: block;
  }
  .ReactTags__tag {
    margin: 0 2px 10px 0;
    background-color: #296ff9;
    color: #fff;
    padding: 6px;
  }
`;

class TokenField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [{ id: 1, text: "Thailand" }, { id: 2, text: "India" }],
            suggestions: []
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }

    render() {
        const { tags, suggestions } = this.state;
        return (
            <Tags>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} />
            </Tags>
        )
    }
};

export default TokenField;

{/*ReactDOM.render(<App />, document.getElementById('app'));*/}