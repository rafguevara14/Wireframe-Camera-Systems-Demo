Play the demo here: https://rafnguevara.itch.io/wireframe-camera-systems

I have used plain webGL to create a simple wireframe scene where you can interact with various cameras.
The main features of this scene is to explore camera systems and object hierachies.

The person is composed of an arm (cube wireframe) that bounces up and down relative to the
head as the person moves. The head consists of a camera and a sphere. A third person camera
is also locked above and behind the person. All of these objects are updated according to the 
position of the head.

Each camera is displayed as a sphere but is not rendered when the current camera equals itself.

# Controls
These controls are accesible from all cameras

wasd: movement

space: jump

## Switching cameras:

3: 3rd person perspective

t: camera that tracks object

m: main camera for first person

## Tracker:

The tracker is located above and to the left of the person. Move or jump to
see the camera track the person

z: aligns the z coordinate of the tracker and the person

## First person: 
Move the mouse to look around

e: toggle between looking forward and behind

## Third person: 
Move the mouse to look around
