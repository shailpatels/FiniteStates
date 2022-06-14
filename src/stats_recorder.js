import {LevelMap} from './support.js';

//Code to save a players anon game states to a remote server
//Enter the IP address for server and set "internet_conn" to true

const server = '';
const internet_conn = false;

export function sendData(d){

	if(!internet_conn){
		console.log('would have sent ', d);
		return;
	}

	fetch(server,{
		method : 'POST',
		headers : {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(d)
	}).then((response) => {
		if(response.ok){
			return response.text();
		}else{
			console.errr("Got bad response from server");
			return;
		}
	}).then((jsonContent) => {
		try{
			let json = JSON.parse(jsonContent);
			if(!json['success']){
				console.error(jsonContent);
			}
		}catch(err){
			console.error(err);
		}

		console.log(jsonContent);
	}).catch((err) => {
		console.error(err);
	});
}


export class UserStats{
	//SRC: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
	uuidv4() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
	}

	constructor(){
		this.user_id = this.uuidv4();
		this.num_screenshots = 0;
		this.num_levels_completed = 0;
		this.num_levels_skipped = 0;
		this.num_errors = 0;
		this.start_time = new Date().toString();
		this.player_knowledge = 5;
		this.course = this.genCourse();
		this.current_level_index = 0;
		this.src = "website";
	}

	genCourse(){
		let seed =  Math.floor(Math.random() * 3);
		let ret = [];
		console.log(seed)
		for(let x in LevelMap){

			if(x.includes('intro')){
				ret.push(x);
				continue;
			}

			let parts = x.split('-');
			let diff = 1;
			let lev = `${parts[0]}-${parts[1]}`;
			if(parts.length > 2){
				diff = parseInt(parts[2],10);
				lev += '-' + parts[2];
			}
			
			if(seed === 0 && diff ===1){
				if(lev === 'dfa-2-2')
					continue;

				//console.log("adding" , x)
				ret.push(x);
			}else if(seed === 1){
				

				if(lev === 'pd-3-1' || lev === 'nfa-3-3' || lev === 'pd-1' || lev === 'pd-3' || lev === 'pd-5-3')
					continue;

				if(lev === 'tm-3-1' || lev === 'pd-3-3' || lev === 'pd-5' || lev === 'tm-2' || lev === 'tm-3-3')
					continue;

				if(lev === 'dfa-3-3' || lev === 'nfa-3-2')
					continue;

				if(lev === 'dfa-2-2')
					continue;

				//console.log("adding" , x)
				ret.push(x);
			}else if(seed === 2){
				//console.log(lev)
				if(lev === 'dfa-1' || lev === 'pd-1' || lev === 'nfa-3-2' || lev === 'pd-3' || lev === 'pd-5-2'){
					continue;
				}

				if(lev === 'pd-3-2' || lev === 'tm-2')
					continue;

				if(lev === 'tm-3-2')
					continue;

				if(lev === 'dfa-2' || lev === 'dfa-3')
					continue;

				if(lev === 'nfa-3' || lev=='nfa-3-2' || lev==='pd-5')
					continue;

				//console.log('adding ' , x);
				ret.push(x);
				
			}

		}

		return ret;

	}
}

export function saveStats(s){
	let data = {};
	for(let prop in s){
		data[prop] = s[prop];
	}

	localStorage.setItem('userStats', JSON.stringify(data));
}

export function statsToJson(s){
	let data = {};
	for(let prop in s){
		data[prop] = s[prop];
	}

	return data;
}

export function loadStats(){
	let data = JSON.parse(localStorage.getItem('userStats'));
	let ret = new UserStats();

	for(let prop in data){
		ret[prop] = data[prop];
	}

	return ret;
}

