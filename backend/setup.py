from setuptools import setup, find_packages

setup(
	name='llmspot',
	version='0.1',
	description='A sample Python package',
	author='FiMo_IT',
	author_email='fmojto@gmail.com',
	packages=find_packages(),
	install_requires=[
	'openai',
	'anthropic'
	],
)