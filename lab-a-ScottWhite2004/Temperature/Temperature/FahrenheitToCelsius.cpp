#include <iostream>
using namespace std;

int main(int, char**)
{ 
cout << "Enter the temperature in Fahrenheit" << endl;
auto f = 0.0f;
cin >> f;
const auto c = (float)5 / (float)9 * (f - 32);
cout << "The temperature in Celsius is " << c << endl;
}