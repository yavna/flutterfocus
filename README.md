## Inspiration
As college students, studying for multiple exams can be overwhelming, especially when we still have other coursework and commitments, which is why we wanted to create a platform that would help you create a plan and motivate you to stick to it!

## What it does
Have an upcoming exam? By inputting the exam date, the exam topics, and how many hours you want to study per day, you can get a personalized study plan, and a study buddy that grows as you study! In addition, a reward system serves as extra motivation. The reward system, which is a butterfly garden, lets you collect a butterfly every time you complete a study system.

## How We built it
We planned the UI/UX using Figma and built the face of our platform using React, so we styled the page with CSS and constructed our elements with JavaScript XML. Behind the scenes, we utilized a Node.js server to host the backend for our generative AI, Gemini, to generate customized study plans and process them into different formats that are easier to work with. The website, which uses a custom Go Daddy domain name "FlutterFocus.study", is hosted through GitHub Pages. We made sure to add  alt-tags to images to improve accessibility throughout our site as well as implementing responsive web design to ensure our site is viewable on devices of different sizes.

## Challenges we ran into
Initially, we had some trouble thinking of an idea that would have a reasonable turnover in 36 hours, but still challenged us with new skills and technologies. As first time hackers, we were unsure of how large the scope of our project should be and our capabilities in terms of making a product in a short amount of time. We ran into a technical challenge when it came to incorporating Gemini and getting the API to work with our project. Not all implementation methods worked with our program, and we had to try multiple APIs with different models before we landed on Gemini. Once we were able to get our desired output from Gemini, we then had to parse the output, so that we could display the results in a more user friendly way. 

## Accomplishments that we're proud of
Being able to integrate Gemini was a huge milestone for us since it is a large part of our platform's functionality. Additionally, for most of us, we started with limited experience in creating React applications from scratch, so we had to learn along the way.  

## What We learned
There is a lot that goes into making an application and just because one tool worked for one project does not always mean it will work for another, making the development process a lot of trial and error. We also learned the importance of version control after many commits, branches, and merges.

## What's next for Flutter Focus
Beyond what we accomplished during WiNGHacks, we want to expand Flutter Focus to enhance the user experience. For example, adding features like a database of course information for a specific institution and allowing the user the edit their study plan would help further tailor study plans to the user. There are many features we wanted to implement in our ideal version of this platform which we can continue to work on beyond WiNGHacks.

Demo Video:
https://youtu.be/4nMlauiQhcc
