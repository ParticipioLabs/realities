import React from 'react';
import 'reactstrap';
// import PropTypes from 'prop-types';
// import SearchField from '../components/SearchField';
import SearchResultList from './SearchResultList';

// const results = [{
//   id: 'need1',
//   title: 'Fire Safety',
//   dependsOn: ['need2'],
// }, {
//   id: 'need2',
//   title: 'Safe Burn Environment',
//   dependsOn: [],
// }, {
//   id: 'need3',
//   title: 'Water',
//   dependsOn: [],
// }];

function Home() {
  // console.log(data);
  return (
    <div className="container">
      <div className="row">
        <div id="" className="col-xs-12 col-lg-6">
          <form>
            <div className="form-group">
              <input
                type="text"
                className="form-control form-control-lg"
                id="searchInput"
                aria-describedby="searchInput"
                placeholder="Enter search term"
              />
            </div>
          </form>
          <div className="row">
            <div id="needs" className="col-xs-12 col-lg-6">
              <h3>Needs</h3>
              <SearchResultList searchResults={[{ title: 'title1' }, { title: 'title2' }]} />
            </div>
            <div id="responsibilities" className="col-xs-12 col-lg-6">
              <h3>Responsibilities</h3>
              <SearchResultList searchResults={[{ title: 'title1' }, { title: 'title2' }]} />
            </div>
          </div>
        </div>
        <div id="" className="col-xs-12 col-lg-6">
          <div className="row">
            <div id="description" className="col-xs-12">
              <div className="card" style={{ width: '20rem' }}>
                <div className="card-body">
                  <h4 className="card-title">Description</h4>
                  <h6 className="card-subtitle mb-2 text-muted">Subtitle</h6>
                  <p
                    className="card-text"
                  >Some quick example text to build on the
                  card title and make up the bulk of the cards content.
                  </p>
                  <a href="http://google.com" className="card-link">Card link</a>
                  <a href="http://google.com" className="card-link">Another link</a>
                </div>
              </div>
            </div>
            <div id="graph" className="col-xs-12">
              <div className="card" style={{ width: '20rem' }}>
                <div className="card-body">
                  <h4 className="card-title">Graph</h4>
                  <h6 className="card-subtitle mb-2 text-muted">Subtitle</h6>
                  <p
                    className="card-text"
                  >Some quick example text to build on the card title
                  and make up the bulk of the cards content.
                  </p>
                  <a href="http://google.com" className="card-link">Card link</a>
                  <a href="http://google.com" className="card-link">Another link</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
