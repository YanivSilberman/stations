import { Component, useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';

let brakePoints = [350, 500];

// https://www.reddit.com/r/Workspaces/top/?t=all

const sources = [
  'https://www.reddit.com/r/workspaces/top.json',
  'https://www.reddit.com/r/battlestations/top.json'
];

function App() {
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    Promise.all(sources.map(url => fetch(url))).then(async ([wo, ba]) => {
      const { data: { children: work } } = await wo.json();
      const { data: { children: battle } } = await ba.json();
      const imgs = [ ...work, ...battle ].sort((a, b) => b.data.ups - a.data.ups).map(i => i.data.url);
      setImages(imgs)
    });
  }, []);

  return (
    <div className="container">
      <header id="stations-header">
        <h1>Stations (for KP)</h1>
      </header>
      <div className="masonry-container">
        <Masonry brakePoints={brakePoints}>
          {images.map((image) => {
            return (
              <Tile src={image} />
            ) 
          })}
        </Masonry>
      </div>
      <footer id="stations-footer">
        Wanna learn French or Spanish while you browse the web? Try Fluent: <a href="https://www.usefluent.co/">https://www.usefluent.co/</a>
      </footer>
    </div>
  );
}

const Tile = ({src}) => {
  return (
    <div className="tile">
			<img src={src} onError='this.style.display = "none"' />
		</div>
  );
};

class Masonry extends Component {
	constructor(props){
		super(props);
		this.state = {columns: 1};
		this.onResize = this.onResize.bind(this);
  }
  
	componentDidMount(){
		this.onResize();
		window.addEventListener('resize', this.onResize)	
	}
	
	getColumns(w){
		return this.props.brakePoints.reduceRight( (p, c, i) => {
			return c < w ? p : i;
		}, this.props.brakePoints.length) + 1;
	}
	
	onResize(){
		const columns = this.getColumns(this.refs.Masonry.offsetWidth);
		if(columns !== this.state.columns){
			this.setState({columns: columns});	
		}
		
	}
	
	mapChildren(){
		let col = [];
		const numC = this.state.columns;
		for(let i = 0; i < numC; i++){
			col.push([]);
		}
		return this.props.children.reduce((p,c,i) => {
			p[i%numC].push(c);
			return p;
		}, col);
	}
	
	render(){
		return (
      <>
        <div className="masonry" ref="Masonry">
          {this.mapChildren().map((col, ci) => {
            return (
              <div className="column" key={ci} >
                {col.map((child, i) => {
                  return <div key={i} >{child}</div>
                })}
              </div>
            )
          })}
        </div>
      </>
		)
	}
}

const Container = styled.div`
  text-align: center;
  // display: flex;
  // align-items: center;
  // justify-content: flex-start;
`;

const Img = styled.li`
  background: ${({ image }) => `url("${image}")`};
`;

export default App;
