import * as React from 'react';

import { IMenuItem } from '../../services/MenuStore';
import { SearchStore } from '../../services/SearchStore';
import { MarkerService } from '../../services/MarkerService';
import { SearchResult } from '../../services/SearchWorker.worker';

// import { PerfectScrollbarWrap } from '../../common-elements/perfect-scrollbar';
import {
  ClearIcon,
  SearchIcon,
  SearchInput,
  // SearchResultsBox,
  SearchWrap,
} from './styled.elements';
import {observer} from "mobx-react";

export interface SearchBoxProps {
  search: SearchStore<string>;
  marker: MarkerService;
  onActivate: (item: IMenuItem) => void;
  className?: string;
}

@observer
export class SearchBox extends React.PureComponent<SearchBoxProps> {

  constructor(props) {
    super(props);
    this.state = {
      activeItemIdx: -1,
    };
  }

  clearResults(term: string) {
    this.props.search.deactivate();
    this.props.search.clearResults(term);
    this.props.marker.unmark();
  }

  clear = () => {
    this.props.marker.unmark();
    this.props.search.deactivate();
    this.props.search.clearResults('');
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 27) {
      // ESQ
      this.clear();
    }

  };

  setResults(results: SearchResult[], term: string) {
    this.props.search.activate();
    this.props.search.setResults(results, term);
    this.props.marker.mark(term);
  }

  search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    if (q.length < 3) {
      this.clearResults(q);
      return;
    }
    this.props.search.search(event.target.value).then(res => {
      this.setResults(res, q);
    });
  };

  render() {
    // const { activeItemIdx } = this.state;

    //results.sort((a, b) => b.score - a.score);

    return (
      <SearchWrap role="search">
        {this.props.search.term && <ClearIcon onClick={this.clear}>×</ClearIcon>}
        <SearchIcon />
        <SearchInput
          value={this.props.search.term}
          onKeyDown={this.handleKeyDown}
          placeholder="Search..."
          type="text"
          onChange={this.search}
        />
      </SearchWrap>
    );
  }
}
