import React, {Component} from 'react';
import {search} from "./model";

class Yatta extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            results: []
        };
        this.input = this._input.bind(this);
        this.submit = this._submit.bind(this);
        this.search = this._search.bind(this);
        this.selectItem = this._selectItem.bind(this);
        this.cancel = _ => console.log('Form canceled');
    }

    _input(query) {
    }

    async _submit(query) {
        this.setState({query});
        const results = await search(query);
        this.setState({results});
    }

    async _search() {
        await this._submit(this.refs.input.value);
    }

    async _selectItem(item) {
        console.log(item);
    }

    componentWillMount() {
        setTimeout(() => this.refs.input.focus(), 200);
    }

    render() {
        return (
            <form keys vi onSubmit={this.submit} onReset={this.cancel} width="100%" height="100%">
                <textbox inputOnFocus ref="input" onSubmit={this.submit}
                         top={0} height={3} right={10} border={{type: 'line'}} style={{border: {fg: 'white'}}}/>
                <button keys mouse right={0} top={0} width={10} height={3} onClick={this.search} border={{type: 'line'}}
                        style={{border: {fg: 'white'}, hover: {fg: 'green', border: {fg: "green"}}}} content=" search"/>
                <box top={4} left={3} right={3} height={1}>{`Search Result For: ${this.state.query}`}</box>
                <list keys mouse interactive ref="list"
                      top={7} left={3} bottom={3} right={3} autoPadding={true}
                      style={{selected: {bg: "lightgreen", fg: "black"}, item: {hover: {bg: "white", fg: "black"}}}}
                      items={this.state.results}
                      onSelect={this.selectItem}
                />
            </form>
        );
    }
}


export default Yatta;
