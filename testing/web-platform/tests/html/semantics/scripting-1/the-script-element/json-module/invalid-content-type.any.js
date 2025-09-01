

const content_types = [
  "application/json+protobuf",
  "application/json+blah",
  "text/x-json",
  "text/json+blah",
  "application/blahjson",
  "image/json",
  "text+json",
  "json+json",
  "text/json/json+json",
  "text/html;+json",
  "text/html+json+xml",
  "text/json/json",

  
  "applic\x00ation/vnd.api+json",     
  "applic\x09ation/vnd.api+json",     
  "applic\x0Aation/vnd.api+json",     
  "applic\x0Dation/vnd.api+json",     
  "applic ation/vnd.api+json",        
  "applic\x7Fation/vnd.api+json",     
  "\x01application/vnd.api+json",     
  "application\x1F/vnd.api+json",     

  
  "application/vnd\x00.api+json",     
  "application/vnd\x09.api+json",     
  "application/vnd\x0A.api+json",     
  "application/vnd\x0D.api+json",     
  "application/vnd .api+json",        
  "application/vnd\x7F.api+json",     
  "application/\x01vnd.api+json",     
  "application/vnd.api\x1F+json",     

  
  "applic\"ation/vnd.api+json",       
  "applic(ation/vnd.api+json",        
  "applic)ation/vnd.api+json",        
  "applic,ation/vnd.api+json",        
  "applic:ation/vnd.api+json",        
  "applic;ation/vnd.api+json",        
  "applic<ation/vnd.api+json",        
  "applic>ation/vnd.api+json",        
  "applic=ation/vnd.api+json",        
  "applic?ation/vnd.api+json",        
  "applic@ation/vnd.api+json",        
  "applic[ation/vnd.api+json",        
  "applic]ation/vnd.api+json",        
  "applic{ation/vnd.api+json",        
  "applic}ation/vnd.api+json",        

  
  "application/vnd\"api\"+json",      
  "application/vnd(api+json",         
  "application/vnd)api+json",         
  "application/vnd,api+json",         
  "application/vnd:api+json",         
  "application/vnd;api+json",         
  "application/vnd<api+json",         
  "application/vnd>api+json",         
  "application/vnd=api+json",         
  "application/vnd?api+json",         
  "application/vnd@api+json",         
  "application/vnd[api+json",         
  "application/vnd]api+json",         
  "application/vnd{api+json",         
  "application/vnd}api+json",         

  
  "aplicación/vnd.api+json",          
  "申请/vnd.api+json",                 
  "app™lication/vnd.api+json",        
  "appli€cation/vnd.api+json",        
  "🚀application/vnd.api+json",       
  "applicatioñ/vnd.api+json",         

  
  "application/vñd.api+json",         
  "application/vnd.apí+json",         
  "application/vnd.api™+json",        
  "application/vnd.api€+json",        
  "application/vnd.中文+json",         
  "application/vnd.api🚀+json",       
  "application/café.api+json",        

  
  "applic ation/vnd api+json",        
  "applic\"ation/vnd\"api+json",      
  "applic(ation/vnd(api+json",        
  "applic)ation/vnd)api+json",        
  "applic,ation/vnd,api+json",        
  "applic=ation/vnd=api+json",        
  "申请/中文.api+json",                 
  "app™/vnd€.api+json",               
  "applic\x00ation/vnd\x00api+json",  
  "applic;ation/vnd;api+json",        
  "applic{ation/vnd{api+json",        
  "applic}ation/vnd}api+json",        
  "applic[ation/vnd[api+json",        
  "applic]ation/vnd]api+json",        
  "applic<ation/vnd<api+json",        
  "applic>ation/vnd>api+json",        

  
  "\"application/vnd.api+json",       
  "application\"/vnd.api+json",       
  "application /vnd.api+json",        
  "/vnd.api+json",                    
  "app\x00lication/vnd.api+json",     

  
  "application/\"vnd.api+json",       
  "application/vnd.api\"+json",       
  "application/ vnd.api+json",        
  "application/vnd.api +json",        
  "application/vnd.api+json\"",       

  
  "\"application\"/\"vnd.api\"+json", 
  "app(lic)ation/vnd(api)+json",      
  "application\x00/\x00vnd.api+json",  
];

for (const content_type of content_types) {
  promise_test(async test => {
    await promise_rejects_js(test, TypeError,
      import(`./module.json?pipe=header(Content-Type,${encodeURIComponent(content_type)})`, { with: { type: "json"} }),
      `Import of a JSON module with MIME type ${content_type} should fail`);
  }, `Try importing JSON module with MIME type ${content_type}`);
}
