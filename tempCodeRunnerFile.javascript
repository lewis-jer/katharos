const solution = (numbers) => {
    if (numbers.length === 0) return 0
    return Math.max(...numbers)
};

solution([7, 2, 6, 3])