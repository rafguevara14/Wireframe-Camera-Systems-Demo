/** @type {WebGLRenderingContext} */
var gl
var canvas;

var aspect;



function updateText(camera_info, color) {

	// document.getElementById("menuStatistics").innerHTML ="<span style='color: " + color; + "'>" + camera_info + " </span>" 
	document.getElementById("menuStatistics").innerHTML = camera_info
	document.getElementById("menuStatistics").style.color = color

}

updateText("First person", "red")


function matrix_vector_mult(m, v) {

	var ret = vec4()
	
	for (var i = 0; i < m.length; i++) {

		var row = m[i];

		ret[i] = row[0] * v[0] + row[1] * v[1] + row[2] * v[2] + row[3] * v[3];
	}

	return ret

}
const sectorCount = 128
const stackCount = 5000
const sectorStep = 2 * Math.PI / sectorCount;
const stackStep = Math.PI / stackCount;
var sectorAngle;
var stackAngle;

const square_vertices = [
	// Front face
	vec3(-1.0, -1.0, 1.0),
	vec3(1.0, -1.0, 1.0),
	vec3(1.0, 1.0, 1.0),
	vec3(-1.0, 1.0, 1.0),

	// Back face
	vec3(-1.0, -1.0, -1.0),
	vec3( -1.0, 1.0, -1.0),
	vec3( 1.0, 1.0, -1.0),
	vec3( 1.0, -1.0, -1.0),

	// Top face
	vec3(-1.0, 1.0, -1.0),
	vec3( -1.0, 1.0, 1.0),
	vec3( 1.0, 1.0, 1.0),
	vec3( 1.0, 1.0, -1.0),

	// Bottom face
	vec3(-1.0, -1.0, -1.0),
	vec3( 1.0, -1.0, -1.0),
	vec3( 1.0, -1.0, 1.0),
	vec3( -1.0, -1.0, 1.0),

	// Right face
	vec3(1.0, -1.0, -1.0),
	vec3( 1.0, 1.0, -1.0),
	vec3( 1.0, 1.0, 1.0),
	vec3( 1.0, -1.0, 1.0),

	// Left face
	vec3(-1.0, -1.0, -1.0),
	vec3( -1.0, -1.0, 1.0),
	vec3( -1.0, 1.0, 1.0),
	vec3( -1.0, 1.0, -1.0),
]

const ground_vertices = [
	vec3(-1000,0,-1000),
	vec3(-1000,0,1000),
	vec3(1000, 0,-1000),
	vec3(1000, 0,1000),
]
const rectangle_vertices = [
	add(vec3(0,-1,1.0),vec3(0,0,0)),
	add(vec3(0,-1,1.0),vec3(0,0,1)),

	add(vec3(0,-1,1.0),vec3(0,0,1)),
	add(vec3(0,-1,1.0),vec3(0,1,1)),

	add(vec3(0,-1,1.0),vec3(0,0,1)),
	add(vec3(0,-1,1.0),vec3(1,0,1)),

	add(vec3(0,-1,1.0),vec3(0,1,1)),
	add(vec3(0,-1,1.0),vec3(1,1,1)),

	add(vec3(0,-1,1.0),vec3(0,0,1)),
	add(vec3(0,-1,1.0),vec3(1,0,1)),

	add(vec3(0,-1,1.0),vec3(0,0,0)),
	add(vec3(0,-1,1.0),vec3(1,0,0)),

	add(vec3(0,-1,1.0),vec3(1,0,0)),
	add(vec3(0,-1,1.0),vec3(1,1,0)),

	add(vec3(0,-1,1.0),vec3(1,1,0)),
	add(vec3(0,-1,1.0),vec3(1,0,0)),

	add(vec3(0,-1,1.0),vec3(1,0,1)),
	add(vec3(0,-1,1.0),vec3(1,1,1)),


	add(vec3(0,-1,1.0),vec3(0,0,0)),
	add(vec3(0,-1,1.0),vec3(0,1,0)),

	add(vec3(0,-1,1.0),vec3(0,1,0)),
	add(vec3(0,-1,1.0),vec3(1,1,0)),

	add(vec3(0,-1,1.0),vec3(1,1,1)),


	// Front face
	// vec3(-0.1, -0.1, 10),
	// vec3(0.1, -0.1, 10),
	// vec3(0.1, 0.1, 10),
	// vec3(-0.1, 0.1, 10),

	// // Back face
	// vec3(-0.1, -0.1, -0.1),
	// vec3( -0.1, 0.1, -0.1),
	// vec3( 0.1, 0.1, -0.1),
	// vec3( 0.1, -0.1, -0.1),

	// // Top face
	// vec3(-0.1, 0.1, -0.1),
	// vec3( -0.1, 0.1, 0.1),
	// vec3( 0.1, 0.1, 0.1),
	// vec3( 0.1, 0.1, -0.1),

	// // Bottom face
	// vec3(-0.1, -0.1, -0.1),
	// vec3( 0.1, -0.1, -0.1),
	// vec3( 0.1, -0.1, 0.1),
	// vec3( -0.1, -0.1, 0.1),

	// // Right face
	// vec3(0.1, -0.1, -0.1),
	// vec3( 0.1, 0.1, -0.1),
	// vec3( 0.1, 0.1, 0.1),
	// vec3( 0.1, -0.1, 0.1),

	// // Left face
	// vec3(-0.1, -0.1, -0.1),
	// vec3( -0.1, -0.1, 0.1),
	// vec3( -0.1, 0.1, 0.1),
	// vec3( -0.1, 0.1, -0.1),
]

function get_sphere_vertices(r){
	var vertices = []
	for(var u = 0; u < stackCount; u++)
	{
		stackAngle = (Math.PI/2)-u*stackStep
		var xy = r*Math.cos(stackAngle)
		var z = r*Math.sin(stackAngle)
		for (var v = 0; v < sectorCount; v++)
		{
			sectorAngle = v*sectorStep
			vertices.push(
				vec3(
					xy*Math.cos(sectorAngle),
					xy*Math.sin(sectorAngle),
					z
				)
			)
		}
	}
	return vertices
}

class Object{

	constructor(vertices){
		this.vertices = vertices
		
		this.position_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.vertices)), gl.DYNAMIC_DRAW)

		this.program = initShaders(gl, "shaders/shape.vert", "shaders/shape.frag");
		gl.useProgram(this.program);

		this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)
		this.positionLoc = gl.getAttribLocation(this.program, "pos")
		gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer)
		gl.enableVertexAttribArray(this.positionLoc)
		gl.vertexAttribPointer(this.positionLoc, 3, gl.FLOAT, false, 0, 0)

		this.u_matrix = gl.getUniformLocation(this.program, "u_matrix")
		this.colorLoc = gl.getUniformLocation(this.program, "color")

		this.color = [1,0,0,1]
		gl.uniform4fv(this.colorLoc, new Float32Array(this.color))

		console.log("Loaded shaders")

		this.mv = mat4()
		this.transform = translate(0,0,0)
	}

	set_camera(camera){
		this.camera = camera
	}


	before_set_transformation() {}

	set_transformation(transform){
		this.before_set_transformation()
		this.transform = transform
	}

	draw(){
		gl.useProgram(this.program);
		gl.bindVertexArray(this.vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);

		gl.uniformMatrix4fv(this.u_matrix, false, new Float32Array(flatten(mult(this.camera.model_view(), this.transform))))
		gl.uniform4fv(this.colorLoc, new Float32Array(this.color))

		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length)
	}

	
}

class Cube extends Object{
	draw(){
		gl.useProgram(this.program);
		gl.bindVertexArray(this.vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);

		gl.uniformMatrix4fv(this.u_matrix, false, new Float32Array(flatten(mult(this.camera.model_view(), this.transform))))

		gl.uniform4fv(this.colorLoc, new Float32Array(this.color))
		gl.drawArrays(gl.LINES, 0, this.vertices.length)
	}
}
class Camera extends Object{

	constructor(eye, at, up, flength, aspect, znear, zfar, stepx, stepy){

		super(get_sphere_vertices(1))
		this.stepy = stepy
		this.stepx = stepx

		this.eye = eye
		this.at = at
		this.up = up
		this.eye = eye
		this.znear = znear
		this.zfar = zfar
		this.flength = flength
		this.aspect = aspect

		this.color = [0,0,1,1]

		this.set_transformation(translate(this.eye))
	}	

	update_position(pos){
		this.eye = pos

		this.set_transformation(translate(this.eye))
	}

	model_view(){
		return mult(
			perspective(this.flength, this.aspect, this.znear, this.zfar),
			lookAt(this.eye, this.at, this.up)
		)
	
	}
}


class Person {

	constructor(walking_speed){

		// super(get_sphere_vertices(1))
		this.head = new Camera(
			vec3(0, 5, 0),
			vec3(0,0,100),
			vec3(0, 1, 0),
			45,
			aspect,
			0,
			80,
			5,
			5
		);

		this.third_person = new Camera(
			vec3(-1, 7, -5),
			this.head.eye,
			vec3(0, 1, 0),
			45,
			aspect,
			0,
			80,
			0.5,
			0.5
		);
		this.tracker = new Camera(
			vec3(10,20,50),
			vec3(0,0,0),
			vec3(0,1, 0),
			90,
			aspect,
			0,
			80,
			5,
			5
		)

		this.head.color = [1,0,0,1]
		this.third_person.color = [0,1,0,1]
		this.tracker.color = [0,0,1,1]

		this.arm_count = 0

		this.walking_speed = walking_speed
		this.arm = new Cube(rectangle_vertices)

		this.third_person_offset = vec3()
	}

	set_camera(camera){
		this.third_person.set_camera(camera)
		this.head.set_camera(camera)
		this.tracker.set_camera(camera)
		this.arm.set_camera(camera)
	}

	
	move(x, y, z){
		this.head.update_position(add(this.head.eye, vec3(x,y,z)))
		this.head.at[0] += x
		this.head.at[2] += z

		this.third_person.update_position(add(this.third_person.eye, vec3(x,y,z)))

		
		var arm_movement = 0.1*Math.sin(this.arm_count/5) -0.1
		this.arm_count += this.walking_speed
		this.arm.set_transformation(translate(this.head.eye[0],  arm_movement + this.head.eye[1],this.head.eye[2]))
		console.log(this.head)
		this.tracker.at = this.head.eye
	}
	walk(x, y, z){
		console.log(x,y,z)
		this.move(this.walking_speed*x,this.walking_speed*y,this.walking_speed*z)
	}

	draw(){
		this.third_person.at = add(this.third_person_offset, this.head.eye)
		if (this.head.camera != this.head) {  this.head.draw() }
		if (this.tracker.camera != this.tracker) { this.tracker.draw() }
		if (this.third_person.camera != this.third_person) { this.arm.draw(); this.third_person.draw() }
	}



}


function initializeContext(){
	canvas = document.getElementById("myCanvas");
	gl = canvas.getContext("webgl2");

	const pixelRatio = window.devicePixelRatio || 1;

    // using clientWidth and clientHeight
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;

	   
	aspect = canvas.width / canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.lineWidth(1.0);

	// gl.enable(gl.DEPTH_TEST);
	// gl.enable(gl.CULL_FACE);
	// gl.cullFace(gl.BACK);

    console.log("WebGL initialized.");

}





/** @type {Object} */
var objects = [];
var ground = null;

var current_camera = null;
var person = null

async function setup() {

    initializeContext();

	person = new Person(1)

	current_camera = person.head

	for (var i = 0; i < 50; i++)
	{

		objects.push(new Cube(square_vertices))
		objects[i].set_transformation(translate(-3,8,i*10))
		

		var channel = i/50
		objects[i].color = [channel, 1, 1, 1]
		

	}

	person.walk(0, 0, 0)
	render();
}


async function render() {

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	

	person.set_camera(current_camera)

	person.draw()

	objects.forEach(element => {
		element.set_camera(current_camera)
		element.draw()
	});

	

	requestAnimationFrame(render);
}

window.onload = setup

var x = 0
var y = 0
const camera_speed = 10

document.onmousemove = (event) => {

	if (current_camera == person.head)
	{

		current_camera.at[0] = -50*event.clientX/canvas.width
		current_camera.at[1] = -50*event.clientY/canvas.height

		current_camera.at[0] += 50
		current_camera.at[1] += 50

	}
	else if(current_camera == person.third_person)
	{
		person.third_person_offset[0] = -5*event.clientX/canvas.width 
		person.third_person_offset[0] += 5

		person.third_person_offset[1] = -10*event.clientY/canvas.height 
		person.third_person_offset[1] += 10

		// current_camera.at[0] += 50
		// current_camera.at[1] += 50
	}
}

var t = 0;
const JUMP_RESOLUTION = 100
function onJump()
{

	

	var y = 1*Math.sin(2*t*Math.PI / JUMP_RESOLUTION)
	person.move(0, y, 0)

	if (t == JUMP_RESOLUTION)
	{

		person.move(0, 0, 0)
		clearInterval(jumpTimer)
		jumpTimer = null
	}

	console.log(t, y)
	t++
}
var jumpTimer = null; 

document.onkeydown = (event) => {


	if (event.key == 'w')
	{
		console.log("walki")
		person.walk(0, 0, 1)
	}
	
	else if (event.key == 's')
	{
		person.walk(0, 0, -1)
	}
	else if (event.key == 'a')
	{
		person.walk(1, 0, 0)
	}
	else if (event.key == 'd')
	{
		console.log(event.key)
		person.walk(-1, 0, 0)
	}
	else if (event.key == 'z' && current_camera==person.tracker)
	{
		person.tracker.eye[2] = person.head.eye[2]
	}

	else if (event.key == '3')
	{
		current_camera = person.third_person
		updateText("Third person", "green")
	}
	else if (event.key == 't')
	{
		current_camera = person.tracker
		updateText("Tracking", "blue")
	}

	else if (event.key == 'm')
	{
		current_camera = person.head
		updateText("First person", "red")
	}
	else if (event.key == 'e')
	{
		if (current_camera == person.head)
		{
			current_camera.at[2] *= -1
		}
	}
	else if (event.key == ' ')
	{
		if (jumpTimer == null)
		{
			jumpTimer = setInterval(onJump, 10)
			t = 0;

		}
	}

}




// document.oncontextmenu = (event) => {
//     event.preventDefault();
// };