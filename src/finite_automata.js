import {API} from '../node_modules/@shailpatels/fss/src/api.js';
import {canvasManager} from '../node_modules/@shailpatels/fss/src/canvasManager.js';

/**
* Levels for finite automata - DFAs and NFAs
*/

export const Levels = [
	{
		"regex" : "hi!",
		"dfa" : true,
		"num_strings" : 1,
		"max_size" : 5,
		"rejects" : [ ],
		"label" : ":)"
	},
	{
		//1
		"dfa" : true,
		"label" : "allOnes",
		"desc" : `<p>Given a string as input, check if its made up of all ones, reject otherwise</p>`,
		"num_strings" : 5,
		"max_size" : 4,
		"diff" : 1,
		"regex" : "1+",
		"reject-regex" : "0*1*0+"
	},
	{
		//2
		"regex" : "^(11)+$",
		"reject-regex" : "1(11)*$",  
		"dfa" : true,
		"num_strings" : 10,
		"max_size" : 4,
		"label" : "isEven",
		"desc" : `
		<p>IsEven: Given a string consisting of only 1s, accept if there are an even number of 1s, reject otherwise.
		<br>Hint: instead of keeping track of the length of the string consider the possible states that could represent 
		this problem: either even so far or odd so far</p>`,
		"diff" : 1
	},
	{
		//3
		"regex" : "^(11)+$",
		"reject-regex" : "1(11)*$",  
		"dfa" : true,
		"num_strings" : 10,
		"max_size" : 4,
		"label" : "isEven",
		"desc" : `
		<p>IsEven: Given a string consisting of only 1s, accept if there are an even number of 1s, reject otherwise.
		</p>`,
		"diff" : 2
	},
	// 4
	{
		"regex" : "(^(11)+$)|(^(00)+$)",
		"reject-regex" : "(1(11)*$)|(0(00)*$)",
		"nfa" : true,
		"num_strings" : 10,
		"max_size" : 4,
		"label" : "isEven+",
		"desc" : "<p>Given a string, accept if it <i>either</i> has an even number of 1s or an even number of 0s, reject otherwise</p>"
	},
	{
		//5
		"regex" : "a*b*a+", 
		"label" : "a<sup>*</sup>b<sup>*</sup>a<sup>+</sup>",
		"nfa" : true,
		"num_strings" : 15,
		"max_size" : 4
	},{
		//6
		"dfa" : true,
		"label" : "abc",
		"num_strings" : 5,
		"regex" : "b*a*c*(abc)+b*c*",
		'reject-regex' : '(b*a*c*)|(c*a*b*)',
		'max_size' : 2,
		"desc" : "<p>Given a string, accept if there is at least one instance of the substring 'abc', otherwise reject</p>"
	},
	{
		//7
		"nfa" : true,
		"label" : "FizzBuzz",
		'desc' : `<p>Given a number represented in unary, accept if the number is divisable by 3 or 5. 
		The unary encoding of 1 is 1, 2 is 11, 3 is 111, and so on.
		</p>`,
		'regex' : '((111)+)|((11111)+)',
		'num_strings' : 6,
		'rejects' : ['11', '1111', '11111111111'],
		'max_size' : 3,
		'accepts' : [''],
	},{
		//8
		'nfa' : true,
		'label' : 'ends c',
		'desc' : `<p>Given a string made of a's, b's and c's, accept if it ends with 'c', reject otherwise</p>`,
		'regex' : 'a*b*c+',
		'num_strings' : 5,
		'max_size' : 5,
		'accepts' : ['c', 'abc'],
		'reject-regex' : 'a*b*',
		'diff' : 1
	},{
		//8
		'nfa' : true,
		'label' : 'ends bc',
		'desc' : `<p>Given a string made of a's, b's and c's, accept if it ends with 'bc', reject otherwise</p>`,
		'regex' : 'a*b*c*(bc)',
		'num_strings' : 5,
		'max_size' : 5,
		'accepts' : ['bc', 'abc'],
		'reject-regex' : 'a*b*cc+',
		'diff' : 2
	},{
		//9
		'nfa' : true,
		'label' : 'ends bc',
		'desc' : `<p>Given a string made of a's, b's and c's, accept if it ends with 'abc', reject otherwise</p>`,
		'regex' : 'a*b*c*(abc)',
		'num_strings' : 5,
		'max_size' : 5,
		'accepts' : ['abc'],
		'reject-regex' : 'b*cc+',
		'diff' : 2
	}
];

export function loadIntro(){
	let desc = document.getElementById('desc');
	desc.innerHTML = `<p>Welcome to your first model of computation! Your goal is to construct a deterministic finite automata (DFA) that accepts the string "hi!".
	Start by double clicking anywhere in the canvas below to create a state. S<sub>0</sub> will always be the start - create one now</p>`

	function onAddFirstNode(){
		if(canvasManager.getInstance().nodes.length !== 1){
			return;
		}

		desc.innerHTML += `<p>Success! Create a second state now</p>`;
		scrollToBot();
	}

	function onAddSecondNode(){
		if(canvasManager.getInstance().nodes.length !== 2){
			return;
		}

		desc.innerHTML += `<p>Double click on state S<sub>1</sub> to mark it an accept state. Now 
		hold shift and Click and Drag
		starting from state S<sub>0</sub> and ending at state S<sub>1</sub> to create a transition. </p>`;
		scrollToBot();
	}

	function addFirstArrow(){
		if(canvasManager.getInstance().arrows.length !== 1){
			return;
		}

		desc.innerHTML += `<p>Now click on the arrow itself to set which symbol to match against, enter the letter 'h' 
		in the textbox that appears. The DFA 
		will read the string one symbol at a time.
		Transitions can also start and end at the same state, create 2 more transitions going from S<sub>1</sub> to S<sub>1</sub></p>`;
		scrollToBot();
	}

	function addTwoArrows(){
		if(canvasManager.getInstance().arrows.length !== 3){
			return;
		}

		desc.innerHTML += `<p>Enter the symbol 'i' for one transition and the symbol '!' for the other.
		As long as there is 1 matching symbol, the machine will step forward. Now press the 'step' or 'run' button 
		to simulate the DFA. The DFA should
		accept the string and update the IO table on the right after a 3 steps. If not, press the 'clear' 
		button to restart.</p>`;
		scrollToBot();
	}

	function unloadIntro(){
		API.removeFunc("add_new_node", onAddFirstNode);
		API.removeFunc("add_new_node", onAddSecondNode);
		API.removeFunc("add_new_arrow", addFirstArrow);
		API.removeFunc("add_new_arrow", addTwoArrows);
	}

	API.addFunc("add_new_node", onAddFirstNode);
	API.addFunc("add_new_node", onAddSecondNode);
	API.addFunc("add_new_arrow", addFirstArrow);
	API.addFunc("add_new_arrow", addTwoArrows);
	return unloadIntro;
}

function scrollToBot(){
	let objDiv = document.getElementById("desc");
	objDiv.scrollTop = objDiv.scrollHeight;
}


export function loadNFAIntro(){
	let desc = document.getElementById('desc');
	desc.innerHTML = `<p>This input could have 0 or many 'a's followed by 0 or many 'b's followed by an 'a'.
	We don't know if we're currently at the last 'a' or if there's something else coming up. Instead, we can
	use the power of non determinism to 'guess' if we're at the last 'a' or not. Let's start by creating a node</p>`;

	function onAddFirstNode(){
		if(canvasManager.getInstance().nodes.length !== 1){
			return;
		}

		desc.innerHTML += `<p>Now create two self transitions on state 0. Enter the letter 'a' for the first 
		transition to handle. The second should handle the letter 'b'.</p>`;
		scrollToBot();
	}

	function addTwoArrows(){
		if(canvasManager.getInstance().arrows.length !== 2){
			return;
		}

		desc.innerHTML += `<p>Now create a new state and mark it as accept and then add a transition between state 0 and 1. This transition 
		will also hanlde an 'a'. At every a, we will branch and take a guess if we're at the end. If the guess is correct
		we accept, otherwise that branch rejects, but the NFA continues to the next symbol.<p>`;
		scrollToBot();
	}

	function addThreeArrs(){
		if(canvasManager.getInstance().arrows.length !== 3){
			return;
		}	

		desc.innerHTML += `<p>Now step through the machine or press 'Run', notice each branch is listed above the canvas. You
		can click on each branch to inspect which symbol and which node its currently on. Notice that every 
		branch is indepedent from each other and the NFA will always branch when there's more than one option to take.
		Press Run to move to the next level, press clear to restart this level. The 'all' branch button will show every node
		active but only shows which symbol the main path is on.</p>`
	}

	API.addFunc("add_new_node", onAddFirstNode);
	API.addFunc("add_new_arrow", addTwoArrows);
	API.addFunc("add_new_arrow", addThreeArrs);

	function unload(){
		API.removeFunc("add_new_node", onAddFirstNode);
		API.removeFunc("add_new_arrow", addTwoArrows);
		API.removeFunc("add_new_arrow", addThreeArrs);

	}

	return unload;
}

