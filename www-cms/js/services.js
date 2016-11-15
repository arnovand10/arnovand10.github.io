/*
ApplicationDbContext
--------------------
1) Database transactions: CRUD operations
2) Cache for loaded content / data
*/
var ApplicationDbContext = {
    "init": function(strConnection) {
        this._strConnection = strConnection; // Connection String to the key in the localstorage
        this._dbData = {
            "info": {
                "title": "FROUFROU: CMS Application",
                "version": "1.0.",
                "modified": "2016-11-15",
                "author": "Arno Van Den Bossche"
            },
            "settings": {},
            "posts": [],
            "categories": [],
            "tags": []
        }; // The data as value of the previous key aka connection string
        // Get the sored data with the key. If the data is not present in the localstorage --> store the previous data from the variable _dbData into the localstorage via the connection string or namespace
        if(Utils.store(this._strConnection) != null) {
            this._dbData = Utils.store(this._strConnection);
        } else {
            Utils.store(this._strConnection, this._dbData);
        }
    },

    "getPosts": function(){
    	var posts = this._dbData.posts;
    	if(posts == null || (posts!=null && posts.length == 0)){
    		return null;
    	}else{
    		return post;
    	}
    },

    "getPostById": function(id){
    	var index = this.findPostIndexById(id);
    	if(index == -1){
    		return null;
    	}
    	return this._dbData.posts[index];
    },
    
    "addPost":function(post){
    	//toevoegen van post aan database
    	if(post !=null && (post.Id == undefined || this.getPostById(post.Id) ==null)){
    		post.Id = Utils.guid();
            post.CreatedAt = new Date().getTime();
            this._dbData.posts.push(post);
            this.save();
            return post;
    	}
    	return null

    },

    "updatePost":function(post){
    	//weizigen van post in database
    	 var index = this.findPostIndexById(post.Id);
        if(index == -1) {
            return false;
        }
        post.UpdatedAt = new Date().getTime();
        this._dbData.posts[index] = post;
        this.save();
        return true;

    },

    "deletePost":function(id){
    	//post volledig deleten
    	var index = this.findPostIndexById(id);
        if(index == -1) {
            return false;
        }
        this._dbData.posts.splice(index, 1);
        this.save();
        return true;
    },
    
    "softDeletePost":function(id){
    	
    	var index = this.findPostIndexById(id);
        if(index == -1) {
            return false;
        }
        var post =  this._dbData.posts[index];
        post.UpdatedAt = new Date().getTime();
        post.DeletedAt = new Date().getTime();
        this._dbData.posts[index] = post;
        this.save();
        return true;
    },
    
    "softUnDeletePost":function(id){
		 var index = this.findPostIndexById(id);
        if(index == -1) {
            return false;
        }
        var post =  this._dbData.posts[index];
        post.UpdatedAt = new Date().getTime();
        post.DeletedAt = null;
        this._dbData.posts[index] = post;
        this.save();
        return true;    	
    },

    "save":function(id){
    	Utils.store(this._strConnection, this._dbData);
    	return true;
    },

    "findPostIndexById": function(id){
    	var posts =this.getPosts();
    	if(posts == null){
    		return -1;
    	}
    	var match = false, i=0, post = null;
    	while(!match && i<posts.length){
    		post = posts[i];
    		if(post.Id == id){
    			match = true;
    		}else{
    			i++;
    		}
    	}
    	if(!match){
    		return -1;
    	}
    	return i;
    }
};