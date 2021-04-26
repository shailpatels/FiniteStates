import {API} from '../node_modules/@shailpatels/fss/src/api.js';
import {simManager} from '../node_modules/@shailpatels/fss/src/simulate.js';
import {canvasManager} from '../node_modules/@shailpatels/fss/src/canvasManager.js';

export const Levels = [
	{
		'pushdown' : true,
		'label' : 'PD',
		'regex' : 'a(a)+b{2}',
		'rejects' : ['abb', 'b'],
		'num_strings' : 5,
		'max_size' : 4
	},
	{
		//1
		'pushdown' : true,
		'label' : 'a<sup>n</sup>b<sup>n</sup>',
		'num_strings' : 10,
		'regex' : 'a{n}b{n}',
		'variables' : ['n', 'm'],
		'max_size' : 5,
		'reject-regex' : 'a{n}b{m}',
		'rejects' : ['bbba', '', 'b', 'a'],
		'desc' : `<p>Given a string of a's and b's, accept if the number of a's equals the number of b's. The string
		should always start with an a and end with b. <i>hint:</i>
		try pushing a symbol onto the stack before reading any input (via the epsilon transition). You can use
		nondetermism to guess and try and pop the symbol you choose to see if the stack is empty. Press help for more info.</p>`,
		'diff' : 1
	},
	{//2
		'label' : 'mirror',
		'desc' : '<p>Given a string if 1s and 0s accept if its a palindrome - in other words the first half of the string is a mirror of the second half</p>',
		'regex' : '(1{n}0{n}1{n})|(0{m}1{m}0{m})',
		'variables' : ['n', 'm'],
		'reject-regex' : '1+0+',
		'pushdown' : true,
		'num_strings' : 4,
		'max_size' : 5,
		'diff' : 2
	},
	{
		//3
		'label' : 'mirror',
		'desc' : '<p>Given a string if 1s and 0s accept if its a palindrome - in other words the first half of the string is a mirror of the second half</p>',
		'regex' : '(1{n}0{n}1{n})',
		'variables' : ['n', 'm'],
		'reject-regex' : '1+0+',
		'pushdown' : true,
		'num_strings' : 4,
		'max_size' : 5,
		'diff' : 1
	},
	{
		//4
		'pushdown' : true,
		'desc' : `<p>In programming, curly brackets are matched by a starting and ending bracket. e.g: "{}". 
		Build a pushdown automata that takes a string of curly brackets, and accepts if each starting bracket 
		has a matching ending bracket. </p>`,
		'label' : '{ }',
		'regex' : `({({})+})+`,
		'reject-regex' : `{*{{}+}}{+`,
		'rejects' : ['{{', '}}'],
		'num_strings' : 5,
		'max_size' : 2
	},
	{
		//5
		'pushdown' : true,
		'label' : 'a<sup>n</sup>b<sup>n</sup>',
		'num_strings' : 10,
		'regex' : 'a{n}b{n}',
		'variables' : ['n', 'm'],
		'max_size' : 5,
		'reject-regex' : 'a{n}b{m}',
		'rejects' : ['bbba', '', 'b', 'a'],
		'desc' : `<p>Given a string of a's and b's, accept if the number of a's equals the number of b's. The string
		should always start with an a and end with b.</p>`,
		'diff' : 2
	},
	{
		//6
		'pushdown' : true,
		'label' : '{ [ ] }',
		'diff' : 2,
		'desc' : `<p>In programming, curly and square brackets are matched by a starting and ending bracket. e.g: "{}" or "[]". 
		Build a pushdown automata that takes a string of curly and square brackets, and accepts if each starting bracket 
		has a matching ending bracket. </p>`,
		'regex' : '({(\\[({})*\\])+})+|({})+(\\[\\])+',
		'reject-regex' : `{*{{}+}}{+([])*]]`,
		'rejects' : ['[', ']', '{]', '[}'],
		'num_strings' : 10,
		'max_size' : 2
	},
	{
		//7
		'pushdown' : true,
		'label' : '{ [ ] }',
		'diff' : 3,
		'desc' : `<p>In programming, curly and square brackets are matched by a starting and ending bracket. e.g: "{}" or "[]". 
		Build a pushdown automata that takes a string of curly and square brackets, and accepts if each starting bracket 
		has a matching ending bracket. Ignore other symbols in the string</p>`,
		'regex' : '({(\\[({i*})*\\])+})+|({i*})+(\\[\\])+',
		'reject-regex' : `{*{{}+}}{+([])*]]`,
		'rejects' : ['[', ']', '{]', '[}'],
		'num_strings' : 10,
		'max_size' : 1
	},
	{
		//8
		'pushdown' : true,
		'label' : 'ab',
		'diff' : 1,
		'desc' : `<p>Given a string, accept if there are exactly 2 occurances of the substring 'ab', reject otherwise
		<i>hint</i>: Before reading any input try storing in the number of matches you're looking for.</p>`,
		'regex' : '(ab){2}',
		'reject-regex' : '(ab){3}',
		'rejects' : ['ab'],
		'num_strings' : 2,
		'max_size' : 1
	},
	{
		//9
		'pushdown' : true,
		'label' : 'ab',
		'diff' : 2,
		'desc' : `<p>Given a string, accept if there are exactly 2 occurances of the substring 'ab', reject otherwise
		.</p>`,
		'regex' : '(ab){2}',
		'reject-regex' : '(ab){3}',
		'rejects' : ['ab'],
		'num_strings' : 2,
		'max_size' : 1
	},
	{
		//10
		'pushdown' : true,
		'label' : 'abc',
		'diff' : 3,
		'desc' : `<p>Given a string, accept if there are exactly 3 occurances of the substring 'abc', reject otherwise
		.</p>`,
		'regex' : '(abc){3}',
		'reject-regex' : '(abc){4}',
		'rejects' : ['abc', 'abcabc'],
		'num_strings' : 2,
		'max_size' : 1
	},
];


export class Stack{
	constructor(index = 0){
		this.stack = [];
		this.stack_div = document.getElementById('stack_inner');
		this.stack_index = 0;
		this.display_branch = index;
	}

	renderStack(){
		this.stack_div.innerHTML = '';
		for(let i  = 0; i < this.stack.length; i++){
			this.stack_div.innerHTML += 
			`<tr id="stack-${i}-row">
				<td data-sym="${this.stack[i]}" class="stack_" id="stack-${i}" >${this.stack[i]}</td>
			</tr>`;
		}
	
	}

	pushSym(sym){
		this.stack.push(sym);

		if(this.display_branch !== simManager.getInstance().current_branch_open){
			return;
		}

		//console.trace();
		//console.log(this.display_branch, simManager.getInstance().current_branch_open, sym);

		this.stack_div.innerHTML += 
		`<tr id="stack-${this.stack_index}-row">
			<td data-sym="${sym}" class="stack_" id="stack-${this.stack_index}" >${sym}</td>
		</tr>`;
		this.stack_index ++;
	}

	popSym(){
		this.stack.pop();
		this.stack_index--;
		if(this.display_branch !== simManager.getInstance().current_branch_open){
			return;
		}
		let tgt = document.getElementById( `stack-${this.stack_index}-row` )
		if(!tgt){
			return;
		}

		tgt.remove();
	}

	last(){
		return this.stack[ this.stack.length -1 ]
	}

	reset(){
		this.stack = [];
		this.stack_index = 0;
		this.stack_div.innerHTML = "";
	}
}


export function loadPDIntro(){
	let desc = document.getElementById('desc');
	desc.innerHTML = `<p>The pushdown automata is similar to a finite state machine, except now we have memory we can
	write to. In addition to matching a symbol, we can now 'push' a symbol onto a stack on a match and also 'pop' a symbol.
	Create a single state now and mark it as accept.</p>`;

	function onAddFirstNode(){
		if(canvasManager.getInstance().nodes.length !== 1){
			return;
		}

		desc.innerHTML += `<p>Now add a self transition onto state 0. Enter 'a' in the first textbox to match
		against the symbol a, and then enter 'a' again into the second textbox, and finally select the 'push' button.
		If this transition matches an 'a', it will then push an 'a' onto the stack.
		. Then add a second transition this time it will match the letter 'b' and pop the symbol 
		'a' off the stack. Make sure to select 'a' for the second textbox and the 'pop' button for the b-transition.</p>`;
		scrollToBot();
	}

	function onAddSecArrow(){
		if(canvasManager.getInstance().arrows.length !== 2){
			return;
		}

		desc.innerHTML += `<p>Now press step to view how the stack changes on the left of the canvas. Notice how the push and pop action are rendered on the
		stack, the right arrow indicating push and the left indicating pop. You should now have a pushdown automata
		that accepts strings with an equal or greater number of a's than b's. Press run to finish the level, and press clear to restart.</p>`;
		scrollToBot();
	}

	function unloadFunc(){
		API.removeFunc("add_new_node", onAddFirstNode);
		API.removeFunc("add_new_arrow", onAddSecArrow);
	}

	API.addFunc("add_new_node", onAddFirstNode);
	API.addFunc("add_new_arrow", onAddSecArrow);

	return unloadFunc;
}

function scrollToBot(){
	let objDiv = document.getElementById("desc");
	objDiv.scrollTop = objDiv.scrollHeight;
}