# 700160 / 700120 Lab Book

## Week 1 - Lab A

23 Sept 2025

### Q1. Hello World

**Question:**

**Solution**
```c++
#include <iostream>

int main(int, char**) {

	std::cout << "Hello World" << std::endl;

	return 0;
}
```
**Test Data**

**Sample Output**

**Reflection**

**Questions**

### Q2. Console Window

**Question:**

**Solution**
```c++
#include <iostream>

int main(int, char**) {

	std::cout << "Hello World" << std::endl;
	int keypress;
	std::cin >> keypress;

	return 0;
}
```

**Test Data**

**Sample Output**

**Reflection**

**Questions**

### Q3. Includes

**Question:**

**Solution**
```c++
int main(int, char**) {

	std::cout << "Hello World" << std::endl;
	int keypress;
	std::cin >> keypress;

	return 0;
}
```
**Test Data**

**Sample Output**

**Reflection**

**Questions**

### Q4. Namespace

**Question:**

**Solution**
```c++
#include <iostream>
using namespace std;

int main(int, char**) {

	std::cout << "Hello World" << std::endl;
	int keypress;
	std::cin >> keypress;

	return 0;
}
```

```c++
#include <iostream>
using namespace std;

int main(int, char**) {

	cout << "Hello World" << endl;
	int keypress;
	cin >> keypress;

	return 0;
}
```

```c++
#include <iostream>


int main(int, char**) {

	cout << "Hello World" << endl;
	int keypress;
	cin >> keypress;

	return 0;
}
```
**Test Data**

**Sample Output**

**Reflection**

**Questions**

### Q5. Create a new project

**Question:**

**Solution**

**Test Data**

**Sample Output**

**Reflection**

**Questions**

### Q6. Temperature

**Question:**

**Solution**
```c++
#include <iostream>
using namespace std;

int main(int, char**)
{ 
cout << "Enter the temperature in Fahrenheit" << endl;
float f;
cin >> f;
float c = (5.0f/9.0f) * (f-32);
cout << "The temperature in Celsius is " << c << endl;

return 0;
}
```
**Test Data**

32

33

**Sample Output**

**Reflection**

**Questions**

### Q7. Auto, const and casting

**Question:**

**Solution**
```c++
#include <iostream>
using namespace std;

int main(int, char**)
{ 
cout << "Enter the temperature in Fahrenheit" << endl;
auto f = 0.0f;
cin >> f;
const auto c = (float)5 / (float)9 * (f - 32);
cout << "The temperature in Celsius is " << c << endl;

return 0;
}
```
**Test Data**

**Sample Output**

**Reflection**

**Questions**

### Q8. Static Assert

**Question:**

**Solution**
```c++
#include <iostream>
using namespace std;
int main(int, char**)
{
	const int sizeOfInt = sizeof(int);
	const int sizeOfPointer = sizeof(int*);
	static_assert (sizeOfInt == sizeOfPointer, "Pointers and int are different sizes");
}
```
**Test Data**
x64
x86
**Sample Output**

**Reflection**

**Questions**
