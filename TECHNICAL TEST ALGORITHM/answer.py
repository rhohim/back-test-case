def reverse_string(string):
    letters = ""
    number = ""

    for char in string:
        if char.isalpha():
            letters += char
        elif char.isdigit():
            number += char

    reversed_letters = ""
    for char in letters:
        reversed_letters = char + reversed_letters  

    result = reversed_letters + number
    return result

def longest(sentence):
    words = sentence.split()
    
    longest_word = ""
    max_length = 0

    for word in words:
        if len(word) > max_length:
            longest_word = word
            max_length = len(word)
    return f"{longest_word}: {max_length} character"

def count(input_array, query_array):
    output = []
    
    for query in query_array:
        count = input_array.count(query)
        output.append(count)
    
    return output

def diagonal(matrix):
    n = len(matrix)
    first_diagonal ,second_diagonal = [], []  
    first_sum = 0
    second_sum = 0

    for i in range(n):
        first_diagonal.append(matrix[i][i])
        second_diagonal.append(matrix[i][n - 1 - i])
        first_sum += matrix[i][i]           
        second_sum += matrix[i][n - 1 - i]  

    
    result = first_sum - second_sum
    return f"({first_diagonal} = {first_sum}) - ({second_diagonal} = {second_sum}) = {result}"

#Question 1
input_string = "NEGIE1"
result = reverse_string(input_string)
print(result, "\n") 

#Question 2
sentence = "Saya sangat senang mengerjakan soal algoritma"
result = longest(sentence)
print(result, "\n")

#Question 3
INPUT = ['xc', 'dz', 'bbb', 'dz']
QUERY = ['bbb', 'ac', 'dz']
result = count(INPUT, QUERY)
print(result, "\n")  

#Question 4
matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
result = diagonal(matrix)
print(result, "\n")

#USE Python3