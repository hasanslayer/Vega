using Microsoft.AspNetCore.Mvc;
using Vega.Models;

namespace Vega.Controllers
{
    [Route("/api/vehicles")]//this a base route and we don't need to repeat them for every action (delete,create,edit,...)
    public class VehiclesController : Controller
    {
        [HttpPost]
        public IActionResult CreateVehicle([FromBody]Vehicle vehicle)//  FromBody : the data of object [complex object] 
                                                                    //in the body of the request
        {
            return Ok(vehicle);
        }
    }
}