using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using Vega.Models;

namespace Vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }
        public int ModelId { get; set; }

        public bool IsRegistered { get; set; }
        [Required]
        public ContactResource Contact { get; set; }


        public ICollection<int> Features { get; set; } //int : beacuse we want to send just int [ id of feature]

        public VehicleResource()
        {
            Features = new Collection<int>();
        }
    }
}