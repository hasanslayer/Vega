namespace Vega.Controllers.Resources
{
    public class ModelResource
    {
        public int Id { get; set; }
       
        public string Name { get; set; }
        // public Make Make { get; set; } these comment cause a loop between make and model
        // public int MakeId { get; set; }
    }
}