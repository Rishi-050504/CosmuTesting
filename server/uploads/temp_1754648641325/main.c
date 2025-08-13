#include <stdio.h>
#include <string.h>

int main() {
    char name[10];
    printf("Enter your name: ");
    gets(name); // unsafe, buffer overflow risk
    for(int i = 0; i <= strlen(name); i++) { // off-by-one: accesses null terminator
        printf("%c", name[i]);
    }
    // missing return statement
}