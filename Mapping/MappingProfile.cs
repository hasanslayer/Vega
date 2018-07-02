using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Vega.Controllers.Resources;
using Vega.Models;

namespace Vega.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Domain to API Resource
            CreateMap<Make, MakeResource>();
            CreateMap<Model, ModelResource>();
            CreateMap<Feature, FeatureResource>();
            CreateMap<Vehicle, VehicleResource>()
                .ForMember(vr => vr.Contact, opt => opt.MapFrom(v => new ContactResource { Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone }))
                .ForMember(vr => vr.Features, opt => opt.MapFrom(v => v.Features.Select(vf => vf.FeatureId)));


            // API Resource to Domain
            CreateMap<VehicleResource, Vehicle>()//the shape of domain class is differend from the shape of api resource
                .ForMember(v => v.Id, opt => opt.Ignore())// Ignore to modify the Id of vehicle
                .ForMember(v => v.ContactName, opt => opt.MapFrom(vr => vr.Contact.Name))// (target object, where we can find it)
                .ForMember(v => v.ContactEmail, opt => opt.MapFrom(vr => vr.Contact.Email))
                .ForMember(v => v.ContactPhone, opt => opt.MapFrom(vr => vr.Contact.Phone))
                .ForMember(v => v.Features, opt => opt.Ignore()) // Automapper doesn't matter to attempt this properities (Features)
                .AfterMap((vr, v) =>
                {
                    // remove unselected features
                    var removedFeatures = new List<VehicleFeature>(); //this list because we can't remove Features While iteration {Exception}
                    foreach (var f in v.Features)
                        if (!vr.Features.Contains(f.FeatureId))
                            removedFeatures.Add(f);
                    foreach (var f in removedFeatures)
                        v.Features.Remove(f);

                    // Add new features 
                    foreach (var id in vr.Features)
                        if (!v.Features.Any(f => f.FeatureId == id))
                            v.Features.Add(new VehicleFeature { FeatureId = id });


                }); //AfterMap(source obj,target obj)




        }
    }
}