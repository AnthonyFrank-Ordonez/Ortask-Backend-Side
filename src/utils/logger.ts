const info = (...params: unknown[]) => {
	if (process.env.NODE_ENV !== 'test') console.log(...params);
};

const error = (...params: unknown[]) => {
	if (process.env.NODE_ENV !== 'test') console.error(...params);
};

export default { info, error };
