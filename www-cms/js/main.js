function ready(cb) {
    /in/.test(document.readyState)
    ? setTimeout(ready.bind(null, cb), 90)
    : cb();
};

ready(function(){

    var App = {
        "init": function() {
            this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
            this._applicationDbContext.init('ahs.dds.cms'); // Intialize the ApplicationDbContext with the connection string as parameter value
            
            this.unitTestPosts(); // Unit Testing: Posts
        },
        "unitTestPosts": function() {
            // TEST
            if(this._applicationDbContext.getPosts() == null) {
                // CREATE POST
                var post = new Post();
                post.Title = 'Nintendo NES Classic Review - Schattig, maar komt iets tekort';
                post.Synopsis = 'Hij is klein, hij is schattig en hij verschijnt op precies het juiste moment. Rara wat is dat? Dat moet de NES Classic zijn, die het vast goed gaat doen in de komende cadeautjesperiode. Althans: als hij leverbaar is. Nintendo heeft een perfect moment uitgekozen om het kleine hebbedingetje op de markt te brengen, en er is dan ook veel belangstelling voor de miniconsole. Overigens is er wat verwarring over de naam van het ding, want Nintendo hanteert verschillende varianten. Op de doos wordt het aangeduid als Nintendo Classic Mini, op de site heeft Nintendo het over de NES Classic Edition en in persberichten wordt het apparaatje aangeduid als Nintendo Classic Mini: Nintendo Entertainment System. Wij houden het voorlopig maar op NES Classic.';
                post.Story = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An quod ita callida est, ut optime possit architectari voluptates? Nunc haec primum fortasse audientis servire debemus. Quem Tiberina descensio festo illo die tanto gaudio affecit, quanto L. Qui autem esse poteris, nisi te amor ipse ceperit? Ergo adhuc, quantum equidem intellego, causa non videtur fuisse mutandi nominis. Duo Reges: constructio interrete. Mihi enim erit isdem istis fortasse iam utendum. Quid sequatur, quid repugnet, vident. </p><p>Quasi vero, inquit, perpetua oratio rhetorum solum, non etiam philosophorum sit. Quae cum essent dicta, finem fecimus et ambulandi et disputandi. Iubet igitur nos Pythius Apollo noscere nosmet ipsos. Id enim natura desiderat. Graece donan, Latine voluptatem vocant. Odium autem et invidiam facile vitabis. Etenim si delectamur, cum scribimus, quis est tam invidus, qui ab eo nos abducat? Verba tu fingas et ea dicas, quae non sentias? Quae cum magnifice primo dici viderentur, considerata minus probabantur. Honesta oratio, Socratica, Platonis etiam. </p><p>Scio enim esse quosdam, qui quavis lingua philosophari possint; Quod quidem iam fit etiam in Academia. Hoc simile tandem est? Quae autem natura suae primae institutionis oblita est? Quid dubitas igitur mutare principia naturae? </p><p>Quid de Pythagora? Cur deinde Metrodori liberos commendas? Hoc ipsum elegantius poni meliusque potuit. Cui Tubuli nomen odio non est? Age, inquies, ista parva sunt. Ut pulsi recurrant? Etenim semper illud extra est, quod arte comprehenditur. Equidem, sed audistine modo de Carneade? </p><p>Aliter enim explicari, quod quaeritur, non potest. Mihi enim satis est, ipsis non satis. Nam quibus rebus efficiuntur voluptates, eae non sunt in potestate sapientis. Si enim ad populum me vocas, eum. Sed ad bona praeterita redeamus. Inde sermone vario sex illa a Dipylo stadia confecimus. Non quaero, quid dicat, sed quid convenienter possit rationi et sententiae suae dicere. Ad corpus diceres pertinere-, sed ea, quae dixi, ad corpusne refers? Isto modo, ne si avia quidem eius nata non esset. Quacumque enim ingredimur, in aliqua historia vestigium ponimus. </p>'
                var postAdded = this._applicationDbContext.addPost(post);
                console.log(postAdded);
            } else {
                // UPDATE A POST
                var id = this._applicationDbContext.getPosts()[0].Id;
                var post = this._applicationDbContext.getPostById(id);
                if(post != null) {
                    post.Title = 'Nintendo NES Classic Review - Schattig, maar komt iets tekort';
                    var result = this._applicationDbContext.updatePost(post);
                    console.log(result);
                }
                // SOFT DELETE OR UNDELETE A POST
                post = this._applicationDbContext.getPostById(id);
                if(post != null) {
                    var result = (post.DeletedAt == null || post.DeletedAt == undefined)?this._applicationDbContext.softDeletePost(post.Id):this._applicationDbContext.softUnDeletePost(post.Id);
                    console.log(result);
                }
                // DELETE A POST
                post = this._applicationDbContext.getPostById(id);
                if(post != null) {
                    var result = this._applicationDbContext.deletePost(post.Id)
                    console.log(result);
                }
            }
        }
    };

    App.init();
});