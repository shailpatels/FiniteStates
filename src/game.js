
import {initAPI, API} from '../node_modules/@shailpatels/fss/src/api.js';
import {clearGame} from '../node_modules/@shailpatels/fss/src/input.js';
import {step, simManager} from '../node_modules/@shailpatels/fss/src/simulate.js';
import {buildTransitionTable} from '../node_modules/@shailpatels/fss/src/lib/graph.js';
import {canvasManager} from '../node_modules/@shailpatels/fss/src/canvasManager.js';
import {updateSelectedArrow} from '../node_modules/@shailpatels/fss/src/input.js';
import {main as FSMmain } from  '../node_modules/@shailpatels/fss/src/canvas.js';
import {toggleDarkMode} from '../node_modules/@shailpatels/fss/src/renderer.js';
import {sendData, saveStats, loadStats, UserStats, statsToJson} from './stats_recorder.js';

import {addConfetti} from './confetti.js';

import '../fent-randexp/randexp.min.js'; 

import * as dfa from './finite_automata.js';
import * as pd from './pushdown.js';
import * as tm from './turing_machine.js'
import {LevelMap} from './support.js';

initAPI();
API.is_external = true;
API.stack = {};
API.tapes = {};
API.stack[0] = new pd.Stack();
API.tapes[0] = new tm.TuringMachine(0);

API.newStack = (index) => { return new pd.Stack(index); }
API.newTape = (index) => {return new tm.TuringMachine(index); }

var userStats = null;

class GameManager{
	constructor(){
		this.num_strings = 0;
		this.strings_correct  = 0;
		this.current_level = 'dfa-intro';
		this.can_run = true;
	}

	reset(){
		this.num_strings = 0;
		this.strings_correct = 0;
	}

	updateLevelsPassed(){
		this.strings_correct++;
		if(this.strings_correct >= this.num_strings ){
			buildTransitionTable('t_table');
			updateStats();
			this.can_run = false;
			userStats.num_levels_completed++;
			userStats.now_time = new Date().toString();

			sendData(statsToJson(userStats));
			userStats.num_errors = 0;
		}
	}

	getLevel(tgt = ""){
		if(tgt === ""){
			tgt = this.current_level;
		}
		
		if(tgt.includes("dfa") || tgt.includes("nfa")){
			return dfa.Levels[LevelMap[tgt]];
		}else if(tgt.includes("pd")){
			return pd.Levels[LevelMap[tgt]];
		}else if(tgt.includes("tm")){
			return tm.Levels[LevelMap[tgt]];
		}else{
			throw 'getLevel : bad level target';
		}
	}

	getNextLevel(tgt=""){
		if(tgt.includes("dfa")){
			return dfa.nextLevels[LevelMap[tgt]];
		}
	}
}

let gameManager = new GameManager();
var timeout = null;
var unloadFunc = null;

FSMmain();
init();


function init(){

	let run_delay = 200;
	let CM = canvasManager.getInstance();

	function run(){
		step();
		if(!gameManager.can_run){
			return;
		}

		if(gameManager.strings_correct > 4){
			run_delay = 10;
		}
		timeout = setTimeout(() => {run()}, run_delay);
	}

	function resetSimHelper(){

		function copyTape(old_t, new_t){
		    for(let x in old_t){
		        if(x === 'tgt_index'){
		            continue;
		        }
		        new_t[x] = old_t[x];
		    }
		}

		gameManager.can_run = true;
		gameManager.strings_correct = 0;
		run_delay = 200;
		//clear any highlighting and innertext
		for(let i = 0; i < gameManager.num_strings; i++){
			let r = document.getElementById(`actual-${i}`);
			r.innerHTML = "";
			r.className = "";
			let r2 = document.getElementById(`expected-${i}`);
			r2.className = "";
		}
		hideTTable();
		
		if(API.config['pushdown']){
			for(let x in API.stack){
				API.stack[x].reset();
			}
			API.stack = {};
			API.stack[0] = new pd.Stack();
			API.stack[0].renderStack();
		}

		if(API.config['tm']){
			for(let x in API.tapes){
				API.tapes[x].reset();
			}
			
			let tm_cpy = API.tapes[0];
			API.tapes = {};
			API.tapes[0]  = new tm.TuringMachine();
			copyTape(tm_cpy, API.tapes[0]);
		}


	}

	function hideTTable(){
		document.getElementById('stats_menu').style.display = 'none';
	}

	document.getElementById('step_btn').addEventListener('click', () => {
		step();

	});
	document.getElementById('run_btn').addEventListener('click', () => {
		setTimeout(() => {run()}, 0);
	});
	document.getElementById('clear_btn').addEventListener('click', () => {
		clearGame();
		//document.getElementById('desc').innerHTML = '';	
		document.getElementById('stats_menu').style.display = 'none';
		if(gameManager.current_level === 'dfa-intro'){
			unloadFunc();
			unloadFunc =  dfa.loadIntro();
		}else if(gameManager.current_level === 'nfa-intro'){
			unloadFunc();
			unloadFunc = dfa.loadNFAIntro();
		}else if(gameManager.current_level === 'pd-intro'){
			unloadFunc();
			unloadFunc = pd.loadPDIntro();
		}else if(gameManager.current_level === 'tm-intro'){
			unloadFunc();
			unloadFunc = tm.loadTMIntro();
		}
		gameManager.strings_correct = 0;
		simManager.getInstance().resetSim();
		resetSimHelper();
		//clearIOTable();
		//loadLevel(Levels[gameManager.current_level]);
	});
	document.getElementById('reset_sim').addEventListener('click', () => {
		simManager.getInstance().resetSim();
		document.getElementById('stats_menu').style.display = 'none';

		if(timeout != null){
			clearTimeout(timeout);
		}

		for(let x in API.stack){
			API.stack[x].reset();
		}
		API.stack = {};

		if(API.config['tm']){
			for(let x in API.tapes){
				API.tapes[x].reset();
			}

			//console.log(API.tapes[0])
			API.tapes[0].renderTape();
		}
	});

	API.addFunc("update-success", () => {
		gameManager.updateLevelsPassed();
	});

	API.addFunc("update-bad", () => {
		gameManager.can_run = false;
	});

	API.addFunc("reset_sim", () => {
		resetSimHelper();
	});

	API.addFunc("update_selected_arrow", () => {
		if(API.config['pushdown']){
			CM.selected_arrow.action = document.getElementById('push_opt').checked ? 'push' : 'pop';
		}

		if(API.config['tm']){
			CM.selected_arrow.direction = document.getElementById('tm_opt_left').checked ? 'left' : 'right';
		}
	});

	API.addFunc("update_arrow_menu", () => {
		if(API.config['pushdown']){
			document.getElementById('pop_opt').checked = CM.selected_arrow.action === 'pop';
			document.getElementById('push_opt').checked = CM.selected_arrow.action === 'push';
		}

		if(API.config['tm']){
			document.getElementById('tm_opt_left').checked = CM.selected_arrow.direction === 'left';
			document.getElementById('tm_opt_right').checked = CM.selected_arrow.direction === 'right';

			if(!CM.selected_arrow.direction || (CM.selected_arrow.direction!== 'left' && CM.selected_arrow.direction!== 'right')){
				document.getElementById('tm_opt_left').checked = true;
			}
		}
	});

	API.addFunc("update-bad", () => {
		userStats.num_errors++;
		saveStats(userStats);
	})

	if(!localStorage.getItem('gamestate')){

		displayWelcome();

		loadLevel( gameManager.getLevel('dfa-intro') );
		unloadFunc = dfa.loadIntro();
	}
	else
	{
		let gamestate = JSON.parse(localStorage.getItem('gamestate'));
		gameManager.current_level = gamestate['current_level'];

		if(gameManager.current_level === 'dfa-intro'){
			loadLevel( gameManager.getLevel('dfa-intro') );
			unloadFunc = dfa.loadIntro();
		}else if(gameManager.current_level === 'nfa-intro'){
			loadLevel( gameManager.getLevel('nfa-intro') );
			unloadFunc = dfa.loadNFAIntro();
		}else if(gameManager.current_level === 'pd-intro'){
			loadLevel( gameManager.getLevel('pd-intro') );
			unloadFunc = pd.loadPDIntro();
		}else if(gameManager.current_level === 'tm-intro'){
			loadLevel( gameManager.getLevel('tm-intro') );
			unloadFunc = tm.loadTMIntro();
		}else{
			loadLevel(gameManager.getLevel( gameManager.current_level ));
		}
	}

	if(!localStorage.getItem('userStats')){
		userStats = new UserStats();
		userStats.current_level = gameManager.current_level;
		saveStats(userStats);
	}else{
		userStats = loadStats();
	}

	localStorage.setItem('gamestate', `{ "current_level" : "${gameManager.current_level}" }`);
	userStats.current_level = gameManager.current_level;

	document.getElementById('out').addEventListener('keydown', (e) => {
		if(e.key !== 'Tab'){
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		if(API.config['pushdown']){
			document.getElementById('push_opt').focus();
		}

		if(API.config['tm']){
			document.getElementById('tm_opt_left').focus();
		}
	});

	document.getElementById('skip').addEventListener('click', () => {
		userStats.num_levels_skipped ++;
		loadNext();
	});

	document.getElementById('push_opt').addEventListener('keydown', handleTabFromFirstOpt );
	document.getElementById('tm_opt_left').addEventListener('keydown', handleTabFromFirstOpt );
	function handleTabFromFirstOpt(e){
		if(e.key === 'Enter'){
			if(API.config['pushdown']){
				document.getElementById('push_opt').checked = true;
			}

			if(API.config['tm']){
				document.getElementById('tm_opt_left').checked = true;
			}
			return;
		}

		if(e.key !== 'Tab'){
			return;
		}
		e.stopPropagation();
		e.preventDefault();

		if(API.config['pushdown']){
			document.getElementById('pop_opt').focus();
		}

		if(API.config['tm']){
			document.getElementById('tm_opt_right').focus();
		}
	}

	document.getElementById('screenshot').addEventListener('click', () => {
        //take a screenshot of the canvs, SRC :https://stackoverflow.com/questions/11112321/how-to-save-canvas-as-png-image
        let dataURL = canvas.toDataURL();
        let newTab = window.open();
        newTab.document.body.innerHTML = `<p>Right click the image below and press 'save as image'.</p><img src=${dataURL} width="100%" height="100%">`;
        userStats.num_screenshots ++;
    });

	document.getElementById('pop_opt').addEventListener('keydown', handleTablFromSecOpt);
	document.getElementById('tm_opt_right').addEventListener('keydown', handleTablFromSecOpt);
	function handleTablFromSecOpt(e){
		if(e.key === 'Enter'){
			if(API.config['pushdown']){
				document.getElementById('pop_opt').checked = true;
			}

			if(API.config['tm']){
				document.getElementById('tm_opt_right').checked = true;
			}
			return;
		}

		if(e.key !== 'Tab'){
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		document.getElementById('if_').focus();
	}

	document.getElementById("close1").addEventListener("click", hideHelp);
	document.getElementById("close2").addEventListener("click", hideHelp);
	function hideHelp(){
		document.getElementById("help").style.display = "none";
	}
	document.getElementById("help-btn").addEventListener("click", () => {
		document.getElementById("help").style.display = "block";
	});

	document.getElementById("welcome-close").addEventListener("click", () => {
		document.getElementById("welcome").style.display = "none";
	});

	document.getElementById("player-expertise").addEventListener("change", () => {
		userStats.player_knowledge = document.getElementById("player-expertise").valuel;
	})

	
	window.addEventListener("beforeunload", function(event) {
  		saveStats(userStats);
  		sendData(statsToJson(userStats));
	});

	handleToggleDarkMode();

	document.getElementById('clear-progress-btn').addEventListener('click', () => {
		//option to remove user progress
		localStorage.removeItem('userStats');
		localStorage.removeItem('gamestate');
		window.location.reload();
	});
}


/**
* Build the input/output table
* @param {Number} num_strings
* @param {String} regex to generate strings from - note this should be a string type
* @param {Number=100} max_str_size max size for any string
*/
function generateIOTable(num_strings, regex, variables, max_str_size = 100){
	for(let num = 0; num < num_strings; num++){
		let next = `<tr><td id=str-${num}`;
		let new_regex = prepRegex(regex, variables, max_str_size);
		let full_string = generateFromRegex( new RegExp(new_regex), max_str_size );
		
		addStringToTable(full_string);
	}
}

function prepRegex(regex, variables, max_str_size){
	if(!variables){
		return regex;
	}

	let map = {

	};

	function unique(val){
		for(let key in map){
			if(map[key] === val){
				return false;
			}
		}

		return true;
	}

	for(let i = 0; i < variables.length; i++){
		let r = Math.floor(Math.random() * max_str_size);
		if(r === 0){
			r = 1;
		}
		while(!unique(r)){
			r = Math.floor(Math.random() * max_str_size);
			if(r === 0){
				r = 1;
			}
		}
		map[ variables[i] ] = r;
	}
	//console.log(map)

	for(let i = 0; i < variables.length; i++){
		regex =  regex.replaceAll(variables[i],  map[variables[i]].toString() );
	}
	return regex;
}

function clearIOTable(){
	document.getElementById('ioTable').innerHTML = `
	<thead>
		<tr>
			<th id="input_label"></th>
			<th>Expected</th>
			<th>Actual</th>
		</tr>
		</thead>
		<tbody id="tbody">
			
		</tbody>
	`;
}

function setLabel(label){
	document.getElementById("input_label").innerHTML = label;
}

function addStringToTable(string, expect_status = 'Accept'){
	let tgt = document.getElementById("tbody");
	let next = `<tr><td id=str-${gameManager.num_strings}`;

	let ret = '';
	for(let i = 0; i < string.length; i++){
		ret += `<span id="str-${gameManager.num_strings}-${i}">${string[i]}</span>`;
	}

	tgt.innerHTML += `${next} data-full-string="${string}">${ret}</td>
		<td data-expected-status="${expect_status}" id='expected-${gameManager.num_strings}'>${expect_status}</td>
		<td data-expected='${status}' id='actual-${gameManager.num_strings}'></td></tr>`;

	gameManager.num_strings++;

	
	API.tapes[0].test_strings.push(string);
	
}

function generateFromRegex(regex, max_str_size){
	let randexp = new RandExp(regex);
	randexp.max = max_str_size;
	return randexp.gen();
}


function updateStats(){
	let tgt =document.getElementById('fsm_stats');
	document.getElementById('stats_menu').style.display = 'block';
	let CM = canvasManager.getInstance();
	let SM = simManager.getInstance();
	tgt.innerHTML = `<p>States: ${CM.nodes.length}, 
	transitions: ${CM.arrows.length}</p>`;
	//steps: ${SM.getTotalSteps()}
	tgt = document.getElementById('stats_next_level');

	let old_btn = document.getElementById('next_btn');
	if(old_btn){
		old_btn.remove();
	}

	if(userStats.current_level_index + 1 < userStats.course.length){
		let new_btn = document.createElement("button");
		new_btn.innerHTML = "Next Level";
		new_btn.id = "next_btn";
		new_btn.addEventListener("click", () => {
			loadNext();
		});

		tgt.appendChild(new_btn);
	}

	//tgt.innerHTML += `<button id="next_btn" onclick="loadLevel()" >Next Level</button>`;

	userStats.level = {
		'num_nodes' : CM.nodes.length,
		'num_arrows' : CM.arrows.length
	};

	saveStats();
}



function loadLevel(level){
	if(!level){
		console.error('level :', level);
		throw 'Given bad level!';
	}	

	if(level['accepts'] !== undefined){
		for (let x of level['accepts']){
			addStringToTable(x, 'Accept');
		}
	}

	generateIOTable(level['num_strings'], level['regex'], level['variables'], level['max_size']);

	if(level['rejects'] !== undefined){
		for (let x of level['rejects']){
			addStringToTable(x, 'Reject');
		}
	}

	if(level['reject-regex'] !== undefined){
		for(let i = 0; i < level['num_strings'];i++){
			let new_regex = prepRegex(level['reject-regex'], level['variables'], level['max_size']);
			let s = generateFromRegex(new_regex, level['max_size']);
			addStringToTable(s,"Reject");
		}
	}

	if(level['desc'] !== undefined){
		let desc = document.getElementById('desc');
		desc.innerHTML =level['desc'];
	}

	if(level['dfa']){
		setConfig('tfff');
	}else if(level['nfa']){
		setConfig('ftff');
	}else if(level['pushdown']){
		renderStack();
		renderPushdownOptions();
		setConfig('fftf');
	}else if(level['tm']){
		if(level['default']){
			API.tapes[0].default_sym = level['default'];
		}
		tm.addTape(0,API.tapes[0])
		setConfig('ffft');
		renderTuringMachineOptions();

		let t = API.tapes[0];
		t.setInitial(t.test_strings[0]);
		t.acceptFunc = level['accept'];
		t.is_return = level['return'];
		//console.log(API.tapes[0]);
	}

	setLabel(level['label']);
	gameManager.total_strings = level['num_strings'];


	/**
	* set each config optin in the API
	* @param {String} t = true, f = false, index = dfa,nfa,pd,tm
	*/
	function setConfig(code="ffff"){
		API.config['dfa'] = code[0] === 't';
		API.config['nfa'] = code[1] === 't';
		API.config['pushdown'] = code[2] === 't';
		API.config['tm'] = code[3] === 't'
	}
}


function loadNext(){
	document.getElementById('clear_btn').click();
	gameManager.reset();
	document.getElementById('tbody').innerHTML = "";
	document.getElementById('tape-container').innerHTML = "";


	if(unloadFunc){
		if(gameManager.current_level === 'dfa-intro'){
			unloadFunc();
		}else if(gameManager.current_level === 'nfa-intro'){
			unloadFunc();
		}else if(gameManager.current_level === 'pd-intro'){
			unloadFunc();
		}else if(gameManager.current_level === 'tm-intro'){
			unloadFunc();
		}
	}


	gameManager.current_level = userStats.course[userStats.current_level_index+1];

	if(!gameManager.current_level){
		addConfetti();
		document.getElementById('finish_menu').style.display = 'block';
		sendData(statsToJson(userStats));
		return;
	}

	console.log('loading ', gameManager.current_level)

	if(gameManager.current_level === 'dfa-intro'){
		loadLevel( gameManager.getLevel('dfa-intro') );
		unloadFunc = dfa.loadIntro();
	}else if(gameManager.current_level === 'nfa-intro'){
		loadLevel( gameManager.getLevel('nfa-intro') );
		unloadFunc = dfa.loadNFAIntro();
	}else if(gameManager.current_level === 'pd-intro'){
		loadLevel( gameManager.getLevel('pd-intro') );
		unloadFunc = pd.loadPDIntro();
	}else if(gameManager.current_level === 'tm-intro'){
		loadLevel( gameManager.getLevel('tm-intro') );
		unloadFunc = tm.loadTMIntro();
	}else{
		loadLevel(gameManager.getLevel());
	}

	userStats.current_level_index++;
	localStorage.setItem('gamestate', `{ "current_level" : "${gameManager.current_level}" }`);
}


function renderStack(){
	document.getElementById('stack').style.display = '';
}

function hideStack(){
	document.getElementById('stack').style.display = 'none';	
}

function renderPushdownOptions(){
	document.getElementById('arrow-pushdown').style.display = 'block';
	document.getElementById('out').style.display = '';
}

function hidePushdownOptions(){
	document.getElementById('arrow-pushdown').style.display = 'none';
	document.getElementById('out').style.display = 'none';
}

function renderTuringMachineOptions(){
	document.getElementById('out').style.display = '';
	document.getElementById('tm-opts').style.display = 'block';
}

function hideTuringMachineOptions(){
	document.getElementById('tm-opts').style.display = 'none';
	document.getElementById('out').style.display = 'none';
}


document.getElementById('toggle_dark').addEventListener('change', () => {
	handleToggleDarkMode();
});

function handleToggleDarkMode(){
	let tgt = document.getElementById('toggle_dark');
	
	
	API.config['light-mode'] = !tgt.checked;
	

	toggleDarkMode();

	if(!API.config['light-mode']){
		document.body.style.backgroundColor = 'black';
		if(API.config['tm'])
			document.getElementsByClassName('current_cell')[0].style.borderColor = 'white';
		document.getElementById('canvas').style.border = 'thin solid white';
		document.getElementById('stats_menu').style.backgroundColor = 'black';
		document.getElementById('help').style.backgroundColor = 'black';
	}else{
		document.body.style.backgroundColor = 'white';
		if(API.config['tm'])
			document.getElementsByClassName('current_cell')[0].style.borderColor = 'black';
		document.getElementById('canvas').style.border = 'thin solid black';
		document.getElementById('stats_menu').style.backgroundColor = 'white';
		document.getElementById('help').style.backgroundColor = 'white';
	}
}

function displayWelcome(){
	document.getElementById("welcome").style.display = "block";
}
