using TrailMates.Core.Exceptions;

namespace TrailMates.Core.ValueObjects;

public sealed record TrailId
{
   public Guid Value { get; }

   public TrailId(Guid value)
   {
      if (value == Guid.Empty)
         throw new InvalidEntityIdException(value);
      
      Value = value;
   }
   
   public static implicit operator TrailId(Guid value)
      => new(value);
}