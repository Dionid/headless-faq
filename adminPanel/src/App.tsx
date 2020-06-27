import React, { Component } from "react"
import { Admin, Resource, ShowGuesser, ListGuesser, EditGuesser } from 'react-admin';
import HelpIcon from "@material-ui/icons/Help"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
// @ts-ignore
import buildHasuraProvider from 'ra-data-hasura-graphql'
import MyLayout from "./layout/custom"
import { createMuiTheme } from '@material-ui/core/styles'
import {QuestionList} from "./resources/question/list"
import {QuestionEdit} from "./resources/question/edit"
import {QuestionCreate} from "./resources/question/create"
import ApolloClient from 'apollo-boost';
import {AnswerList} from "./resources/answer/list"
import {AnswerEdit} from "./resources/answer/edit"
import {AnswerCreate} from "./resources/answer/create"
import { AnswerShow } from "src/resources/answer/show"
import { QuestionShow } from "src/resources/question/show"

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    background: {
      default: "#f2f4f7"
    }
  },
  typography: {
    fontFamily: [
        'Lato',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  overrides: {

  },
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_DB_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("backend_api_key")}`,
  }
});

class App extends Component {
  state = { dataProvider: null }

  componentDidMount() {
    buildHasuraProvider({ client })
      .then((dataProvider:any) => this.setState({ dataProvider }));
  }

  render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return <div>Loading</div>;
    }

    return (
      <Admin layout={MyLayout} theme={theme} dataProvider={dataProvider}>
        <Resource icon={HelpIcon} name="faq_question" show={QuestionShow} list={QuestionList} edit={QuestionEdit} create={QuestionCreate}/>
        <Resource icon={CheckCircleIcon} name="faq_answer" show={AnswerShow} list={AnswerList} edit={AnswerEdit} create={AnswerCreate}/>
      </Admin>
    );
  }
}

export {
  App
}
