import * as React from 'react';

import {SearchResult} from "../../services/SearchWorker.worker";
import {IMenuItem} from "../../services";
import {H2, MiddlePanel, Row} from "../../common-elements";
import {AdvancedMarkdown} from "../Markdown/AdvancedMarkdown";


export interface SearchResultListProps {
  term: string;
  results: SearchResult[];
  getItemById: (id: string) => IMenuItem | undefined;
}

export interface SearchResultItemProps {
  item: IMenuItem;
  score: number;
}

// export interface SearchResultListState {
//   activeItemIdx: number;
// }

function trunc(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;
};

const middlePanelWrap = component => <MiddlePanel compact={true}>{component}</MiddlePanel>;

export class SearchResultItem extends React.PureComponent<SearchResultItemProps> {
  render() {
    const {item, score} = this.props;

    return (
      <>
        <Row>
          <MiddlePanel compact={false}>
            <H2>
              {item.name} {score}
            </H2>
          </MiddlePanel>
        </Row>
        <AdvancedMarkdown source={item.description ? trunc(item.description, 500) : ''} htmlWrap={middlePanelWrap}/>
      </>
    );
  }
}

export class SearchResultList extends React.PureComponent<SearchResultListProps> {
  render() {
    const {results, getItemById} = this.props;

    results.sort((a, b) => b.score - a.score);

    const normalizedResults = results.slice(0, 10).map(result => {
      return {
        item: getItemById(result.meta)!,
        score: result.score
      }
    });

    return normalizedResults.map(result => <SearchResultItem score={result.score} item={result.item} key={result.item.id}/>);
  }
}
