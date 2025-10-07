# C++ Lab A

This lab introduces you to some very basic elements of C++ programming. As you progress through this year, you'll be learning a lot about the intricacies of the C++ programming language, that will hopefully prove invaluable both during your career (assuming you become a C++ developer) and also as technical background for the likely questions you'll face in interviews.
To assist you in remembering these intricacies you'll be using a Lab Book to record your observations and findings as you discover the language, solutions to common problems, and even how you solved a problematic bug.

## GIT

All the source code for this lab exercise is on the GIT

## Lab Book

An example of the Lab book can be found on the GIT within this Lab

## Q1. Copilot tutorial

Complete the short Copilot tutorial on the Microsoft Learn website, to gain an understanding of how to use Copilot for more than just writing code.

<https://learn.microsoft.com/en-us/visualstudio/debugger/debug-with-copilot?view=vs-2022>

Note:

- This tutorial uses C#, but it does not require any previous knowledge of C#
- The answers provided by Copilot can vary each time you use Copilot.

## Q2. Hello World

Locate the Solution Explorer within Visual Studio and select the HelloWorld project. Right click on this project and select Build. This should compile and link the project. Now run the HelloWorld program.

Change between Debug and Release mode. Compile again and rerun the program.

Note: It is good practice when transferring projects between different PCs to "retarget" the project to the latest version of the compiler.  This is done by right clicking on the project (or solution) in the Solution Explorer and selecting "Retarget".  Remember to "Rebuild" the project after a change of target.

## Q3. Console window

A command window is automatically opened when you run a console application. This window is also automatically closed when the program terminates. Delay the termination of the program by adding the following two lines to the end of your code:

```c++
int keypress;
std::cin >> keypress;
```

This now requests an integer value before termination of the program

## Q4. Includes

Remove the statement:

```c++
#include <iostream>
```

Compile the program. What is the effect? Replace the statement and continue.

Notice that we do not add the .h extension to the header file name.  Extensions are only added for your own header files or for legacy system header files.

## Q5. Namespace

Add the statement

```c++
using namespace std;
```

Compile the program. What is the effect?
Now remove all instances of the code

```c++
std::
```

Compile the program. What is the effect?
Now remove

```c++
using namespace std;
```

The statement informs the C++ compiler to look in the std namespace for any names/labels that it cannot find in the programs default namespace.

## Q6. Create a new project

Create a new Visual C++ Empty project called “Temperature” by using the New Project dialog `File->New->Project`.
You should now have a new project which contains no files.

## Q7. Temperature

Create a new cpp file within the temperature project and write a program to input a Fahrenheit measurement, convert it and output a Celsius value. The conversion formula is

```c++
c = 5/9 (f - 32)
```

Confirm that your conversion programme gives the correct outputs

- `32 F gives 0 C`
- `33 F gives 0.555 C`

## Q8. Auto, const and casting

Now rewrite your temperature example using the auto keyword, constants and explicit casting

Does this make the code easier or more difficult to understand?

## Q9. Static Assert

Create a new project call `sizeOf` that includes the following lines of code:

```c++
const int sizeOfInt = sizeof(int);
const int sizeOfPointer = sizeof(int*);
static_assert (sizeOfInt == sizeOfPointer, "Pointers and int are different sizes");
```

Select a different architecture (e.g. x86 or x64) to see if you can make the assert fail.

Experiment by adding further asserts to your program

Remember these static asserts are completely free.  The check is done at compile time, so no code is added to your solution.
