using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Vega.Controllers.Resources;
using Vega.Models;

namespace Vega.Controllers
{
    [Route("/api/vehicles")]//this a base route and we don't need to repeat them for every action (delete,create,edit,...)
    public class VehiclesController : Controller
    {
        private readonly IMapper mapper;
        public VehiclesController(IMapper mapper)
        {
            this.mapper = mapper;

        }

        [HttpPost]
        public IActionResult CreateVehicle([FromBody]VehicleResource vehicleResource)//  FromBody : the data of object [complex object] in the body of the request
        {
            var vehicle = mapper.Map<VehicleResource, Vehicle>(vehicleResource);
            return Ok(vehicle);
        }
    }
}