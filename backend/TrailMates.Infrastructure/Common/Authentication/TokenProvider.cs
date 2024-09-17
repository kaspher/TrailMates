using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TrailMates.Application.Abstractions.Authentication;
using TrailMates.Domain.Entities.Users;

namespace TrailMates.Infrastructure.Common.Authentication;

public class TokenProvider(IConfiguration configuration) : ITokenProvider
{
    public string Create(User user)
    {
        var handler = new JwtSecurityTokenHandler();

        var privateKey = Encoding.UTF8.GetBytes(AuthenticationConfiguration.PrivateKey);

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(privateKey),
            SecurityAlgorithms.HmacSha256
        );

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddDays(2),
            Subject = GenerateClaims(user)
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    private static ClaimsIdentity GenerateClaims(User user)
    {
        var ci = new ClaimsIdentity();

        ci.AddClaim(new Claim("id", user.Id.ToString()));
        ci.AddClaim(new Claim(ClaimTypes.Name, user.FirstName));
        ci.AddClaim(new Claim(ClaimTypes.Email, user.Email));

        foreach (var role in user.Roles)
            ci.AddClaim(new Claim(ClaimTypes.Role, role));

        return ci;
    }
}
