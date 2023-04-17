let executionContext = [];

// let globalCode = '';

let IDGenerator = {
	blockId: 1,
	codeId: 1,
};

// class Program {
// 	constructor(statements) {
// 		this.statements = statements;
// 	}
// 	execute() {
// 		for (let i = 0; i < this.statements.length; i++) {
// 			this.statements[i].execute();
// 		}
// 	}
// 	getElement() {
// 		let newElement = document.createElement('div');
// 		newElement.setAttribute('class', 'program');
// 		for (let i = 0; i < this.statements.length; i++) {
// 			newElement.appendChild(this.statements[i].getElement());
// 		}
// 		return newElement;
// 	}
// }

class ForLoop {
	constructor({ id, start = '', condition = '', increment = '', body = '' }) {
		this.id = id;
		this.start = start;
		this.ending = condition;
		this.increment = increment;
		this.body = [];
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'forLoop');
		// newElement.setAttribute('class', 'forLoop isBlock');
		// newElement.setAttribute('class', 'isBlock');
		newElement.setAttribute('id', this.id);

		let initializer = document.createElement('input');
		initializer.setAttribute('type', 'text');
		initializer.setAttribute('value', '');
		initializer.setAttribute('placeholder', 'initialization');
		initializer.setAttribute('class', 'forLoopInitialization');
		initializer.addEventListener('change', (e) => {
			this.start = e.target.value;
		});

		let ending = document.createElement('input');
		ending.setAttribute('type', 'text');
		ending.setAttribute('value', '');
		ending.setAttribute('placeholder', 'Ending');
		ending.setAttribute('class', 'forLoopCondition');
		ending.addEventListener('change', (e) => {
			this.ending = e.target.value;
		});

		// let incrementField = document.createElement('input');
		// incrementField.setAttribute('type', 'text');
		// incrementField.setAttribute('value', this.increment);
		// incrementField.setAttribute('class', 'forLoopIncrement');
		// incrementField.addEventListener('change', (e) => {
		// 	this.increment = e.target.value;
		// });

		// A dropdown for increment field
		let incrementField = document.createElement('select');
		incrementField.setAttribute('class', 'forLoopIncrement');
		let incrementOptions = ['++', '--'];
		incrementOptions.forEach((option) => {
			let newOption = document.createElement('option');
			newOption.setAttribute('value', option);
			newOption.textContent = option;
			incrementField.appendChild(newOption);
		});

		// event listener for increment field
		incrementField.addEventListener('change', (e) => {
			this.increment = e.target.value;
		});

		let body = document.createElement('div');
		body.setAttribute('class', 'forLoopBody isBlock');
		body.setAttribute('id', this.id + 'body');

		body.addEventListener('dragover', (event) => allowDrop(event));

		body.addEventListener('drop', (e) => {
			e.preventDefault();
			e.stopPropagation();
			console.log('Itrigger');
			console.log({ e });
			const newNode = dropIsBlock(e);
			// drop(e);
			// this.body = [...e.target.children];
			// console.log({ body: this.body, children: [...e.target.children] });
			// this.body = [...e.target.childNodes];
			this.body = [...this.body, newNode];
			console.log({ afterBody: this.body });
		});

		// body.addEventListener('change', (e) => {
		// 	console.log(e.target);
		// 	this.body = [...(this.body + e.target)];
		// });

		let forNode = document.createElement('span');
		forNode.setAttribute('class', 'codeBlockText');
		forNode.textContent = 'Loop from:';

		let toNode = forNode.cloneNode(true);
		toNode.textContent = 'to:';

		let usingNode = forNode.cloneNode(true);
		usingNode.textContent = 'using:';
		newElement.appendChild(forNode);
		newElement.appendChild(initializer);
		newElement.appendChild(toNode);
		newElement.appendChild(ending);
		newElement.appendChild(usingNode);
		newElement.appendChild(incrementField);
		newElement.appendChild(body);

		// newElement.innerHTML = `for (${this.start}; ${this.condition}; ${this.increment}) {`;
		// newElement.appendChild(this.body.forEach(b, () => b.getElement()));
		// newElement.innerHTML += '};';
		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		let firstLine = document.createElement('div');
		firstLine.setAttribute('class', 'codeLine');
		firstLine.textContent = `for (${this.start}; ${this.condition}; ${this.increment}) {`;
		code.appendChild(firstLine);
		// let code = `<span>for (${this.start}; ${this.condition}; ${this.increment}) {`;
		if (this.body.length > 0) {
			this.body.forEach((b) => {
				console.log({ b });
				let newLine = document.createElement('div');
				newLine.setAttribute('class', 'codeLine');
				newLine.appendChild(b.getPHPCode());
				// code += b.getPHPCode();
				code.appendChild(newLine);
			});
		}
		let lastLine = document.createElement('div');
		lastLine.setAttribute('class', 'codeLine');
		lastLine.textContent = '};';
		// code += '};';
		code.appendChild(lastLine);
		// console.log({ code2: code });
		return code;
	}
}

class DisplayOutput {
	constructor({ id, variable = '' }) {
		this.id = id;
		this.variable = variable;
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'displayOutput');
		newElement.setAttribute('id', this.id);

		let message = document.createElement('span');
		message.setAttribute('class', 'codeBlockText');
		message.textContent = 'Display';

		let variableField = document.createElement('input');
		variableField.setAttribute('type', 'text');
		variableField.setAttribute('value', this.variable);
		variableField.setAttribute('class', 'displayOutputVariable');
		variableField.addEventListener('change', (e) => {
			this.variable = e.target.value;
		});
		newElement.appendChild(message);
		newElement.appendChild(variableField);
		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		code.setAttribute('class', 'codeLine');
		// let firstLine = document.createElement('div');
		// firstLine.setAttribute('class', 'codeLine');

		let echo = document.createElement('span');
		echo.setAttribute('class', 'keyword');
		echo.textContent = 'echo ';

		let endingComma = document.createElement('span');
		endingComma.setAttribute('class', 'codeBlockText');
		endingComma.textContent = ';';

		let valueNode = parseValue(this.variable);
		code.appendChild(echo);
		code.appendChild(valueNode);
		code.appendChild(endingComma);
		return code;
	}
}

class WhileLoop {
	constructor({ condition = '', id, body = '' }) {
		this.condition = condition;
		this.condition1 = condition;
		this.relation = '';
		this.body = [];
		this.id = id;
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'whileLoop');
		newElement.setAttribute('id', this.id);

		let conditionField = document.createElement('input');
		conditionField.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		conditionField.setAttribute('class', 'forLoopCondition');
		conditionField.addEventListener('change', (e) => {
			this.condition = e.target.value;
		});

		let conditionField1 = document.createElement('input');
		conditionField1.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		conditionField1.setAttribute('class', 'forLoopCondition');
		conditionField1.addEventListener('change', (e) => {
			this.condition1 = e.target.value;
		});

		let relationField = document.createElement('input');
		relationField.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		relationField.setAttribute('class', 'forLoopCondition');
		relationField.addEventListener('change', (e) => {
			this.relation = e.target.value;
		});

		let body = document.createElement('div');
		body.setAttribute('class', 'forLoopBody isBlock');
		body.setAttribute('id', this.id + 'body');

		body.addEventListener('dragover', (event) => allowDrop(event));

		body.addEventListener('drop', (e) => {
			// console.log('Itrigger');
			// // console.log(e);
			// // drop(e);
			// this.body = [...this.body, e.target];
			e.preventDefault();
			e.stopPropagation();
			console.log('Itrigger');
			// console.log({ e });
			const newNode = dropIsBlock(e);
			this.body = [...this.body, newNode];
			// console.log({ afterBody: this.body });
		});

		let whileNode = document.createElement('span');
		whileNode.setAttribute('class', 'codeBlockText');
		whileNode.textContent = 'while';

		newElement.appendChild(whileNode);
		newElement.appendChild(conditionField);
		newElement.appendChild(relationField);
		newElement.appendChild(conditionField1);
		newElement.appendChild(body);

		return newElement;
	}
	getPHPCode() {
		// let code = `while (${this.condition}) {`;
		// let code = document.createElement('div');
		// let firstLine = document.createElement('div');
		// firstLine.setAttribute('class', 'codeLine');
		// firstLine.textContent = `while (${this.condition}) {`;
		// code.appendChild(firstLine);

		let code = document.createElement('div');
		let firstLine = document.createElement('div');
		firstLine.setAttribute('class', 'codeLine');

		let codeLine = document.createElement('div');
		codeLine.setAttribute('class', 'codeLine');

		let whileNode = document.createElement('span');
		whileNode.setAttribute('class', 'keyword');
		whileNode.textContent = 'while ';

		let openBracket = document.createElement('span');
		openBracket.setAttribute('class', 'codeBlockText');
		openBracket.textContent = ' ( ';

		let closeBracket = document.createElement('span');
		closeBracket.setAttribute('class', 'codeBlockText');
		closeBracket.textContent = ' ) ';

		let relationNode = document.createElement('span');
		relationNode.setAttribute('class', 'codeBlockText');
		relationNode.textContent = this.relation;

		let curlyBracket = document.createElement('span');
		curlyBracket.setAttribute('class', 'codeBlockText');
		curlyBracket.textContent = ' { ';

		let curlyBracketClose = document.createElement('div');
		curlyBracketClose.setAttribute('class', 'codeLine');
		curlyBracketClose.textContent = '};';

		let condition1Node = parseValue(this.condition);
		let condition2Node = parseValue(this.condition1);

		// codeLine.appendChild(whileNode);
		code.appendChild(whileNode);
		code.appendChild(openBracket);
		code.appendChild(condition1Node);
		code.appendChild(relationNode);
		code.appendChild(condition2Node);
		code.appendChild(closeBracket);
		code.appendChild(curlyBracket);
		if (this.body.length > 0) {
			this.body.forEach((b) => {
				// code += b.getPHPCode();
				let newLine = document.createElement('div');
				newLine.setAttribute('class', 'codeLine');
				console.log({ b });
				newLine.appendChild(b.getPHPCode());
				code.appendChild(newLine);
			});
		}

		// code += '};';

		code.appendChild(curlyBracketClose);

		return code;
	}
}

class VariableDeclaration {
	constructor({ id, name = '', value = '' }) {
		this.name = name;
		this.value = value;
		this.id = id;
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'variableDeclaration');
		newElement.setAttribute('id', this.id);

		let inputFieldName = document.createElement('input');
		inputFieldName.setAttribute('type', 'text');
		// inputFieldName.setAttribute('value', this.name);
		inputFieldName.setAttribute('class', 'variableName');
		inputFieldName.setAttribute('placeholder', 'Name');
		inputFieldName.addEventListener('change', (e) => {
			this.name = e.target.value;
		});

		let inputFieldValue = document.createElement('input');
		inputFieldValue.setAttribute('type', 'text');
		// inputFieldValue.setAttribute('value', this.value);
		inputFieldValue.setAttribute('class', 'variableValue');
		inputFieldValue.setAttribute('placeholder', 'Value');
		inputFieldValue.addEventListener('change', (e) => {
			this.value = e.target.value;
		});

		let equalToSign = document.createElement('span');
		equalToSign.setAttribute('class', 'codeBlockText');
		equalToSign.innerHTML = ' = ';

		let letKeyword = document.createElement('span');
		letKeyword.setAttribute('class', 'codeBlockText');
		letKeyword.innerHTML = 'let ';

		// let endingComma = document.createElement('span');
		// endingComma.setAttribute('class', 'codeBlockText');
		// endingComma.textContent = ';';

		newElement.appendChild(letKeyword);
		newElement.appendChild(inputFieldName);
		newElement.appendChild(equalToSign);
		newElement.appendChild(inputFieldValue);
		// newElement.appendChild(endingComma);
		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		code.setAttribute('class', 'codeLine');
		let variableNamePart = document.createElement('span');
		variableNamePart.setAttribute('class', 'keyword');
		variableNamePart.textContent = `$${this.name}`;

		const parsedValueNode = parseValue(this.value);
		// const valueClass = parsedValue[0] === '$' ? 'variable' : 'value';

		// let valuePart = document.createElement('span');
		// valuePart.setAttribute('class', valueClass);
		// valuePart.textContent = parsedValue;

		let equalToSign = document.createElement('span');
		equalToSign.innerHTML = ' = ';

		let endingComma = document.createElement('span');
		endingComma.textContent = ';';

		code.appendChild(variableNamePart);
		code.appendChild(equalToSign);
		code.appendChild(parsedValueNode);
		code.appendChild(endingComma);

		// code.textContent = `$${this.name} = ${parseValue(this.value)};`;
		return code;
	}
}

class Function {
	constructor(name, parameters, body) {
		this.name = name;
		this.parameters = parameters;
		this.body = body;
		this.body = new Program(body);
	}
}

class Conditional {
	constructor({ condition = '', body = '', id }) {
		this.condition = condition;
		this.condition1 = condition;
		this.relation = '';
		this.body = [];
		this.id = id;
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'conditional');
		newElement.setAttribute('id', this.id);

		let conditionField = document.createElement('input');
		conditionField.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		conditionField.setAttribute('class', 'forLoopCondition');
		conditionField.addEventListener('change', (e) => {
			this.condition = e.target.value;
		});

		let conditionField1 = document.createElement('input');
		conditionField1.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		conditionField1.setAttribute('class', 'forLoopCondition');
		conditionField1.addEventListener('change', (e) => {
			this.condition1 = e.target.value;
		});

		let relationField = document.createElement('input');
		relationField.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		relationField.setAttribute('class', 'forLoopCondition');
		relationField.addEventListener('change', (e) => {
			this.relation = e.target.value;
		});

		let body = document.createElement('div');
		body.setAttribute('class', 'forLoopBody isBlock');
		body.setAttribute('id', this.id + 'body');

		body.addEventListener('dragover', (event) => allowDrop(event));

		body.addEventListener('drop', (e) => {
			// console.log('Itrigger');
			// this.body = [...this.body, e.target];
			e.preventDefault();
			e.stopPropagation();
			console.log('Itrigger');
			// console.log({ e });
			const newNode = dropIsBlock(e);
			this.body = [...this.body, newNode];
			// console.log({ afterBody: this.body });
		});

		let ifNode = document.createElement('span');
		ifNode.setAttribute('class', 'codeBlockText');
		ifNode.innerHTML = 'if ';

		newElement.appendChild(ifNode);
		newElement.appendChild(conditionField);
		newElement.appendChild(relationField);
		newElement.appendChild(conditionField1);
		newElement.appendChild(body);

		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		let firstLine = document.createElement('span');
		firstLine.setAttribute('class', 'keyword');
		firstLine.textContent = `if `;

		let openBracket = document.createElement('span');
		openBracket.setAttribute('class', 'codeBlockText');
		openBracket.textContent = ' ( ';

		let closeBracket = document.createElement('span');
		closeBracket.setAttribute('class', 'codeBlockText');
		closeBracket.textContent = ' ) ';

		let relationNode = document.createElement('span');
		relationNode.setAttribute('class', 'codeBlockText');
		relationNode.textContent = this.relation;

		let curlyBracket = document.createElement('span');
		curlyBracket.setAttribute('class', 'codeBlockText');
		curlyBracket.textContent = ' { ';

		// let closeCurlyBracket = document.createElement('span');
		// closeCurlyBracket.setAttribute('class', 'codeBlockText');
		// closeCurlyBracket.textContent = ' } ';

		let condition1Node = parseValue(this.condition);
		let condition2Node = parseValue(this.condition1);

		code.appendChild(firstLine);
		code.appendChild(openBracket);
		code.appendChild(condition1Node);
		code.appendChild(relationNode);
		code.appendChild(condition2Node);
		code.appendChild(closeBracket);
		code.appendChild(curlyBracket);
		if (this.body.length > 0) {
			this.body.forEach((b) => {
				// code += b.getPHPCode();
				let newLine = document.createElement('div');
				newLine.appendChild(b.getPHPCode());
				newLine.setAttribute('class', 'codeLine');
				code.appendChild(newLine);
			});
		}
		// code += '};';
		let lastLine = document.createElement('div');
		lastLine.setAttribute('class', 'codeLine');
		lastLine.textContent = '};';
		code.appendChild(lastLine);
		return code;

		// return `if (${this.condition}) {${this.body.map((body) =>
		// 	body.getPHPCode()
		// )}}`;
	}
}

class ConditionalElse {
	constructor({ elseCond = '', condition = '', body = '', id }) {
		this.conditionField = condition;
		this.ifBody = [];
		this.elseBody = [];
		this.id = id;
		this.else = elseCond;
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'conditionalElse');
		newElement.setAttribute('id', this.id);

		let conditionField = document.createElement('input');
		conditionField.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		conditionField.setAttribute('class', 'forLoopCondition');
		conditionField.addEventListener('change', (e) => {
			this.condition = e.target.value;
		});

		let conditionField1 = document.createElement('input');
		conditionField1.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		conditionField1.setAttribute('class', 'forLoopCondition');
		conditionField1.addEventListener('change', (e) => {
			this.condition1 = e.target.value;
		});

		let relationField = document.createElement('input');
		relationField.setAttribute('type', 'text');
		// conditionField.setAttribute('value', this.condition);
		relationField.setAttribute('class', 'forLoopCondition');
		relationField.addEventListener('change', (e) => {
			this.relation = e.target.value;
		});

		let ifBody = document.createElement('div');
		ifBody.setAttribute('class', 'forLoopBody isBlock');
		ifBody.setAttribute('id', this.id + 'body');

		ifBody.addEventListener('dragover', (event) => allowDrop(event));

		ifBody.addEventListener('drop', (e) => {
			// console.log('Itrigger');
			// this.ifBody = [...this.body, e.target];
			e.preventDefault();
			e.stopPropagation();
			console.log('Itrigger');
			// console.log({ e });
			const newNode = dropIsBlock(e);
			this.ifBody = [...this.ifBody, newNode];
			// console.log({ afterBody: this.body });
		});

		// let elseField = document.createElement('input');
		// elseField.setAttribute('type', 'text');
		// elseField.setAttribute('value', this.else);
		// elseField.setAttribute('class', 'forLoopCondition');
		// elseField.addEventListener('change', (e) => {
		// 	this.else = e.target.value;
		// });

		let elseBody = document.createElement('div');
		elseBody.setAttribute('class', 'forLoopBody isBlock');
		elseBody.setAttribute('id', this.id + 'body');

		elseBody.addEventListener('drop', (e) => {
			e.preventDefault();
			e.stopPropagation();
			console.log('Itrigger');
			// console.log({ e });
			const newNode = dropIsBlock(e);
			this.elseBody = [...this.elseBody, newNode];
			// console.log({ afterBody: this.body });
		});

		// elseBody.addEventListener('change', (e) => {
		// 	this.elseBody = e.target.value;
		// });

		let elseSign = document.createElement('span');
		elseSign.innerHTML = 'else';

		let ifNode = document.createElement('span');
		ifNode.setAttribute('class', 'codeBlockText');
		ifNode.innerHTML = 'if ';

		newElement.appendChild(ifNode);
		newElement.appendChild(conditionField);
		newElement.appendChild(relationField);
		newElement.appendChild(conditionField1);
		newElement.appendChild(ifBody);
		newElement.appendChild(elseSign);
		newElement.appendChild(elseBody);

		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		let firstLine = document.createElement('div');
		firstLine.setAttribute('class', 'codeLine');

		let ifNode = document.createElement('span');
		ifNode.setAttribute('class', 'keyword');
		ifNode.textContent = 'if ';

		let openBracket = document.createElement('span');
		openBracket.setAttribute('class', 'codeBlockText');
		openBracket.textContent = ' ( ';

		let closeBracket = document.createElement('span');
		closeBracket.setAttribute('class', 'codeBlockText');
		closeBracket.textContent = ' ) ';

		let relationNode = document.createElement('span');
		relationNode.setAttribute('class', 'codeBlockText');
		relationNode.textContent = this.relation;

		let curlyBracket = document.createElement('span');
		curlyBracket.setAttribute('class', 'codeBlockText');
		curlyBracket.textContent = ' { ';

		let condition1Node = parseValue(this.condition);
		let condition2Node = parseValue(this.condition1);

		firstLine.appendChild(ifNode);
		firstLine.appendChild(openBracket);
		firstLine.appendChild(condition1Node);
		firstLine.appendChild(relationNode);
		firstLine.appendChild(condition2Node);
		firstLine.appendChild(closeBracket);
		firstLine.appendChild(curlyBracket);

		// firstLine.textContent = `if (${this.condition}) {`;
		code.appendChild(firstLine);
		if (this.ifBody.length > 0) {
			this.ifBody.forEach((b) => {
				// code += b.getPHPCode();
				let newLine = document.createElement('div');
				newLine.setAttribute('class', 'codeLine');
				newLine.appendChild(b.getPHPCode());
				code.appendChild(newLine);
			});
		}
		// code += '};';
		let lastLine = document.createElement('div');
		lastLine.setAttribute('class', 'codeBlockText');
		lastLine.textContent = '}';
		code.appendChild(lastLine);
		// code += `else {${this.elseBody.map((body) => body.getPHPCode())}}`;
		let elseLine = document.createElement('div');
		elseLine.setAttribute('class', 'keyword');
		elseLine.textContent = `else `;
		elseLine.appendChild(curlyBracket.cloneNode(true));
		code.appendChild(elseLine);
		if (this.elseBody.length > 0) {
			this.elseBody.forEach((b) => {
				// code += b.getPHPCode();
				let newLine = document.createElement('div');
				newLine.setAttribute('class', 'codeLine');
				newLine.appendChild(b.getPHPCode());
				code.appendChild(newLine);
			});
		}
		// code += '};';
		// let lastElseLine = document.createElement('div');
		// lastElseLine.setAttribute('class', 'codeLine');
		// lastElseLine.textContent = '};';
		code.appendChild(lastLine.cloneNode(true));

		return code;

		// return `if (${this.condition}) {${this.ifBody.map((body) =>
		// 	body.getPHPCode()
		// )}} else {${this.elseBody.map((body) => body.getPHPCode())}}`;
	}
}

class ArithemeticExpression {
	constructor({ var1 = '', var2 = '', id }) {
		this.var1Name = var1;
		this.var2Name = var2;
		this.var3Name = '';
		this.var3Value = '';
		this.sign = '+';
		this.id = id;
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'arithemeticExpression');
		newElement.setAttribute('id', this.id);

		let varCField = document.createElement('input');
		varCField.setAttribute('type', 'text');
		varCField.setAttribute('placeholder', 'variable');
		// varCField.setAttribute('value', this.name);
		varCField.setAttribute('class', 'variableName');
		varCField.addEventListener('change', (e) => {
			this.var3Name = e.target.value;
		});

		let varAField = document.createElement('input');
		varAField.setAttribute('type', 'text');
		// varAField.setAttribute('value', this.name);
		varAField.setAttribute('placeholder', 'data');
		varAField.setAttribute('class', 'variableName');
		varAField.addEventListener('change', (e) => {
			this.var1Name = e.target.value;
		});

		let varBField = document.createElement('input');
		varBField.setAttribute('type', 'text');
		// varBField.setAttribute('value', this.name);
		varBField.setAttribute('class', 'variableName');
		varBField.setAttribute('placeholder', 'data');
		varBField.addEventListener('change', (e) => {
			this.var2Name = e.target.value;
		});

		let equalToSign = document.createElement('span');
		equalToSign.innerHTML = ' = ';

		let signSelector = document.createElement('select');
		signSelector.setAttribute('class', 'signSelector');
		let plusSign = document.createElement('option');
		plusSign.setAttribute('value', '+');
		plusSign.innerHTML = '+';
		let minusSign = document.createElement('option');
		minusSign.setAttribute('value', '-');
		minusSign.innerHTML = '-';
		let multiplySign = document.createElement('option');
		multiplySign.setAttribute('value', '*');
		multiplySign.innerHTML = '*';
		let divideSign = document.createElement('option');
		divideSign.setAttribute('value', '/');
		divideSign.innerHTML = '/';
		signSelector.appendChild(plusSign);
		signSelector.appendChild(minusSign);
		signSelector.appendChild(multiplySign);
		signSelector.appendChild(divideSign);

		signSelector.addEventListener('change', (e) => {
			this.sign = e.target.value;
		});

		let letNode = document.createElement('span');
		letNode.innerHTML = 'let ';
		letNode.setAttribute('class', 'codeBlockText');
		newElement.appendChild(letNode);
		newElement.appendChild(varCField);
		newElement.appendChild(equalToSign);
		newElement.appendChild(varAField);
		newElement.appendChild(signSelector);
		newElement.appendChild(varBField);
		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		code.setAttribute('class', 'codeLine');

		let variable = document.createElement('span');
		variable.setAttribute('class', 'variable');
		variable.textContent = `$${this.var3Name}`;

		let equalToSign = document.createElement('span');
		equalToSign.textContent = ' = ';

		let operator = document.createElement('span');
		operator.textContent = ` ${this.sign} `;
		let endingComma = document.createElement('span');
		endingComma.textContent = ';';

		code.appendChild(variable);
		code.appendChild(equalToSign);
		code.appendChild(parseValue(this.var1Name));
		code.appendChild(operator);
		code.appendChild(parseValue(this.var2Name));
		code.appendChild(endingComma);

		// code.textContent = ` = ${this.var1Name} ${this.sign} ${this.var2Name};`;
		return code;
	}
}

class ReadFile {
	constructor({ name = '', id }) {
		this.name = name;
		this.id = id;
		this.storageVariable = '';
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'readFile');
		newElement.setAttribute('id', this.id);

		let inputFieldName = document.createElement('input');
		inputFieldName.setAttribute('type', 'text');
		inputFieldName.setAttribute('placeholder', 'Filename');
		// inputFieldName.setAttribute('value', this.name);
		inputFieldName.setAttribute('class', 'variableName');
		inputFieldName.addEventListener('change', (e) => {
			this.name = e.target.value;
		});

		let storageVariable = document.createElement('input');
		storageVariable.setAttribute('type', 'text');
		storageVariable.setAttribute('placeholder', 'Storage');
		// storageVariable.setAttribute('value', this.name);
		storageVariable.setAttribute('class', 'variableName');
		storageVariable.addEventListener('change', (e) => {
			this.storageVariable = e.target.value;
		});

		let equalToSign = document.createElement('span');
		equalToSign.setAttribute('class', 'codeBlockText');
		equalToSign.innerHTML = ' store to ';

		newElement.innerHTML = `Read `;
		newElement.appendChild(inputFieldName);
		newElement.appendChild(equalToSign);
		newElement.appendChild(storageVariable);
		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		code.setAttribute('class', 'codeLine');

		const storageVariable = parseValue(this.storageVariable);
		const fileNameNode = parseValue(this.name);

		let fopen = document.createElement('div');
		fopen.setAttribute('class', 'codeBlockText');
		// fopen.textContent = ' = fopen(';

		let fileVar = document.createElement('span');
		fileVar.setAttribute('class', 'variable');
		fileVar.textContent = `$file = `;

		let fopenFunc = document.createElement('span');
		fopenFunc.setAttribute('class', 'function');
		fopenFunc.textContent = 'fopen(';

		fopen.appendChild(fileVar);
		fopen.appendChild(fopenFunc);

		let fopenClose = document.createElement('span');
		fopenClose.setAttribute('class', 'codeBlockText');
		fopenClose.textContent = ',"r");';

		fopen.appendChild(fileNameNode);
		fopen.appendChild(fopenClose);

		let fread = document.createElement('span');
		fread.setAttribute('class', 'function');
		fread.textContent = 'fread(';

		let filePlainVar = document.createElement('span');
		filePlainVar.setAttribute('class', 'variable');
		filePlainVar.textContent = '$file';

		let fileSizeFunc = document.createElement('span');
		fileSizeFunc.setAttribute('class', 'function');
		fileSizeFunc.textContent = 'filesize(';
		fileSizeFunc.appendChild(storageVariable.cloneNode(true));

		let fileSizeFuncClosing = document.createElement('span');
		fileSizeFuncClosing.setAttribute('class', 'codeBlockText');
		fileSizeFuncClosing.textContent = ')';
		fileSizeFunc.appendChild(fileSizeFuncClosing);

		fread.appendChild(filePlainVar);
		let comma = document.createElement('span');
		comma.setAttribute('class', 'codeBlockText');
		comma.textContent = ',';
		fread.appendChild(comma);
		fread.appendChild(fileSizeFunc);
		let freadClose = document.createElement('span');
		freadClose.setAttribute('class', 'codeBlockText');
		freadClose.textContent = ');';
		fread.appendChild(freadClose);

		// code.appendChild(storageVariable);
		code.appendChild(fopen);
		code.appendChild(fread);

		// code.textContent = `let ${this.storageVariable} = readFile(${this.name});`;
		return code;
		// return `let ${this.storageVariable} = readFile(${this.name});`;
	}
}

class WriteFile {
	constructor({ name = '', id }) {
		this.name = name;
		this.id = id;
		this.value = '';
	}
	getElement() {
		let newElement = document.createElement('div');
		newElement.setAttribute('class', 'writeFile');
		newElement.setAttribute('id', this.id);

		let inputFieldName = document.createElement('input');
		inputFieldName.setAttribute('type', 'text');
		inputFieldName.setAttribute('placeholder', 'Data');
		// inputFieldName.setAttribute('value', this.name);
		inputFieldName.setAttribute('class', 'variableName');
		inputFieldName.addEventListener('change', (e) => {
			this.name = e.target.value;
		});

		let inputFieldValue = document.createElement('input');
		inputFieldValue.setAttribute('type', 'text');
		inputFieldValue.setAttribute('placeholder', 'File Name');
		// inputFieldValue.setAttribute('value', this.value);
		inputFieldValue.setAttribute('class', 'variableValue');
		inputFieldValue.addEventListener('change', (e) => {
			this.value = e.target.value;
		});

		let equalToSign = document.createElement('span');
		equalToSign.setAttribute('class', 'codeBlockText');
		equalToSign.innerHTML = ' to ';

		newElement.innerHTML = `Write `;
		newElement.appendChild(inputFieldName);
		newElement.appendChild(equalToSign);
		newElement.appendChild(inputFieldValue);

		return newElement;
	}
	getPHPCode() {
		let code = document.createElement('div');
		code.setAttribute('class', 'codeLine');
		const valueNode = parseValue(this.value);
		const fileNameNode = parseValue(this.name);

		let fopen = document.createElement('div');
		fopen.setAttribute('class', 'codeBlockText');
		// fopen.textContent = ' = fopen(';

		let fileVar = document.createElement('span');
		fileVar.setAttribute('class', 'variable');
		fileVar.textContent = `$file = `;

		let fopenFunc = document.createElement('span');
		fopenFunc.setAttribute('class', 'function');
		fopenFunc.textContent = 'fopen(';

		fopen.appendChild(fileVar);
		fopen.appendChild(fopenFunc);

		let fopenClose = document.createElement('span');
		fopenClose.setAttribute('class', 'codeBlockText');
		fopenClose.textContent = ',"w");';

		fopen.appendChild(valueNode);
		fopen.appendChild(fopenClose);

		let fwrite = document.createElement('div');
		fwrite.setAttribute('class', 'codeBlockText');
		// fwrite.textContent = 'fwrite($file, ';

		let fwriteFunc = document.createElement('span');
		fwriteFunc.setAttribute('class', 'function');
		fwriteFunc.textContent = 'fwrite(';

		let fileName = document.createElement('span');
		fileName.setAttribute('class', 'variable');
		fileName.textContent = '$file, ';

		fwrite.appendChild(fwriteFunc);
		fwrite.appendChild(fileName);

		fwrite.appendChild(fileNameNode);

		let fwriteClose = document.createElement('span');
		fwriteClose.setAttribute('class', 'codeBlockText');
		fwriteClose.textContent = ');';

		fwrite.appendChild(fwriteClose);

		code.appendChild(fopen);
		code.appendChild(fwrite);

		// code.textContent = `fwriteFile(fopen(${this.name},"w"), ${this.value});`;
		return code;
		// return `writeFile(${this.name}, ${this.value});`;
	}
}

function allowDrop(e) {
	e.preventDefault();
}

function drag(e) {
	e.dataTransfer.setData('id', e.target.id);
}

function drop(e) {
	e.preventDefault();
	e.stopPropagation();
	console.log("I'm here");
	// console.log({ e });
	// if (
	// 	(e.target.childNodes.length < 1 &&
	// 		e.target.classList.contains('codeBlock')) ||
	// 	e.target.classList.contains('isBlock')
	// )
	if (
		e.target.childNodes.length < 1 &&
		e.target.classList.contains('codeBlock')
	) {
		console.log('I happen');
		let data = e.dataTransfer.getData('id');
		let obj = returnRelevantObject(data);
		// globalCurrentElement.jsObject = obj;
		executionContext.push(obj);
		e.target.appendChild(obj.getElement());
	} else if (e.target.id === 'columnMid') {
		// This is new, added for the new div, remove to regain normality
		console.log('I happen too');
		const newBlock = addCodeBlock();
		// Same as above but with the new div
		let data = e.dataTransfer.getData('id');
		let obj = returnRelevantObject(data);
		// globalCurrentElement.jsObject = obj;
		executionContext.push(obj);
		newBlock.appendChild(obj.getElement());
	}
}

function dropIsBlock(e) {
	console.log('Yaggana Begana');
	if (e.target.classList.contains('isBlock')) {
		console.log('Not so begana anymore');
		var data = e.dataTransfer.getData('id');
		let obj = returnRelevantObject(data);
		// globalCurrentElement.jsObject = obj;
		// executionContext.push(obj);
		e.target.appendChild(obj.getElement());
		return obj;
	}
}

function addCodeBlock() {
	let newBlock = document.createElement('div');
	newBlock.setAttribute('class', 'codeBlock');
	newBlock.addEventListener('drop', (e) => drop(e));
	newBlock.addEventListener('dragover', (event) => allowDrop(event));
	newBlock.setAttribute('class', 'codeBlock');
	newBlock.setAttribute('id', IDGenerator.blockId++);
	document.getElementById('columnMid').appendChild(newBlock);
	return newBlock;
}

function generatePHPCode() {
	let code = document.createElement('div');
	code.setAttribute('class', 'phpCode');
	executionContext.forEach((element) => {
		// code += element.getPHPCode();
		let newLine = document.createElement('div');
		newLine.appendChild(element.getPHPCode());
		code.appendChild(newLine);
	});
	let space = document.getElementById('phpCode');
	// console.log({ code });
	// globalCode = code;
	space.appendChild(code);
	executePHPCode(code);

	// return code;
}

function returnRelevantObject(id) {
	let x;
	switch (id) {
		case 'variableDeclaration':
			x = new VariableDeclaration({
				id: IDGenerator.codeId++,
			});
			break;
		case 'forLoop':
			x = new ForLoop({
				id: IDGenerator.codeId++,
				start: 'X = 0',
				condition: 'X < 10',
				increment: 'X++',
				body: ['lello', 'gello'],
			});
			break;
		case 'whileLoop':
			x = new WhileLoop({
				id: IDGenerator.codeId++,
			});
			break;
		case 'arithematic':
			x = new ArithemeticExpression({
				id: IDGenerator.codeId++,
			});
			break;
		case 'ifCondition':
			x = new Conditional({
				id: IDGenerator.codeId++,
			});
			break;
		case 'conditionalElse':
			x = new ConditionalElse({
				id: IDGenerator.codeId++,
			});
			break;

		case 'readFile':
			x = new ReadFile({
				id: IDGenerator.codeId++,
			});
			break;
		case 'writeFile':
			x = new WriteFile({
				id: IDGenerator.codeId++,
			});
			break;
		case 'displayOutput':
			x = new DisplayOutput({
				id: IDGenerator.codeId++,
			});
			break;
	}
	return x;
}

function executePHPCode(code) {
	// Develp you have the HTML and JS code stored in a variable named 'code'
	// Assume you have an HTML object stored in a variable named 'htmlObject'

	// Convert the HTML object to a string
	const htmlString = new XMLSerializer().serializeToString(code);

	// Parse the HTML string and convert it to a Document object
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, 'text/html');

	// Get the text content of the Document object
	const textContent = doc.documentElement.textContent;

	// Decode the text content to handle special characters
	const decoder = new TextDecoder();
	const decodedText = decoder.decode(new TextEncoder().encode(textContent));

	// Strip all the HTML tags from the decoded text
	const strippedText = decodedText.replace(/(<([^>]+)>)/gi, '');

	// strip all two consecutive spaces from the string
	const spaceStrippedText = strippedText.replace(/  +/g, ' ');

	// Strip all spaces that occur before a ;
	const semiColonStrippedText = spaceStrippedText.replace(/ ;/g, ';');

	// Add spaces after all ;
	const semiColonSpacedText = semiColonStrippedText.replace(/;/g, '; ');

	// // Use the stripped text as needed
	console.log({ semiColonSpacedText });

	// Create a new object to store the request data
	const requestData = { code: semiColonSpacedText };

	// Send the request using the Fetch API
	fetch('phpScript.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestData),
	})
		.then((response) => {
			if (response.ok) {
				// Handle the response from the server
				return response.text();
			} else {
				throw new Error('Network response was not ok.');
			}
		})
		.then((responseText) => {
			// console.log(responseText);
			document.getElementById('phpOutput').innerHTML = responseText;
		})
		.catch((error) => {
			console.error('Error occurred:', error);
		});
}

function parseValue(data) {
	let node = document.createElement('span');

	// Check if data is an integer or a string enclosed in double quotes
	if (
		Number.isInteger(parseInt(data)) ||
		(data[0] === '"' && data[data.length - 1] === '"')
	) {
		// const valueClass = parsedValue[0] === '$' ? 'variable' : 'value';
		node.setAttribute('class', 'value');
		node.textContent = ` ${data} `;
	} else {
		node.setAttribute('class', 'variable');
		node.textContent = ` $${data} `;
	}
	return node;
}
