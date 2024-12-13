from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema.runnable import RunnableLambda ,RunnableSequence
from langchain_community.llms.ctransformers import CTransformers
from langchain.callbacks import StreamingStdOutCallbackHandler
import re , json , requests

def getimg(q):
    url = 'https://www.googleapis.com/customsearch/v1'

        # Parameters for the request
    params = {
        'q': "dishes photo "+q,
        'key': 'AIzaSyB7DMAC4yLekAqVArikYqinq5dO1yrk9wc',
        'cx': '762d6316dc3f3489c',
        'start':2,
        'num':1,
        'searchType':'image',
    }

        # Making the GET request
    onresult = requests.get(url, params=params)
        #print(onresult)
    result = onresult.json()
        #print(result,type(result))
    ab = result.get("items")
    if ab:
        for i in ab:
            return i.get("link")
        

def plain_text_to_json(plain_text):
    # Split the plain text into individual dish entries
    dish_entries = plain_text.strip().split("\n")
    
    # Initialize an empty dictionary to hold the JSON data
    dishes_dict = {}
    
    for entry in dish_entries:
        # Split each entry into the number, dish name, and description
        try:
            dish_num, dish_info = entry.split(". ", 1)
            dish_name, dish_description = dish_info.split(" - ", 1)
            
            # Populate the dictionary with the required fields
            dishes_dict[int(dish_num)] = {
                "dish_name": dish_name.strip(),
                "dish_description": dish_description.strip(),
                "dish_image": "{% static 'image.png' %}"
            }
        except ValueError:
            print(f"Entry not in expected format: {entry}")
    
    return dishes_dict

class lamba():

    def __init__(self):
        pass

    def llama7b(self,bigqu):
        llm = CTransformers(
            model="TheBloke/Llama-2-7B-Chat-GGML", 
            model_file = 'C:\Programs\eatright\llama-2-7b-chat.ggmlv3.q8_0.bin', 
            callbacks=[StreamingStdOutCallbackHandler()]
        )


        template = """
        [INST] <<SYS>>
        you are a food recommender , 
        suggest only top 2-3 dishes name and there description,
        if given input is already a food name then give variety of that food or else give recommend food according to prompt,
        dont recommend veg when prompt is non-veg or non-veg when prompt is veg,
        don't give any extra info, don't use emojis or any alpha numerical just simple straight forward text use hypen and numbers.


        {text}[/INST]
        """

        prompt = PromptTemplate(template=template, input_variables=["text"])

        pipeline = RunnableSequence(prompt, llm)

       # response = pipeline.invoke(bigqu)
        response = """1. Butter Chicken Raita - Rich, creamy butter chicken blended with yogurt, cucumber, and spices.
    2. Minty Cucumber Raita - Refreshing combination of cooling mint and cucumber blended with creamy yogurt.
    3. Spicy Tomato Raita - Tangy and spicy tomato raita made with freshly grated tomatoes, yogurt, and a hint of cumin."""
        
        js  = plain_text_to_json(response) 

        for i in list(js.keys()):
            qu = js.get(i).get('dish_name')
            js[i]['dish_image'] = getimg(qu)

        
        return js

#for testing purpose
# obj = lamba()
# print(obj.llama7b("best burgers"))


