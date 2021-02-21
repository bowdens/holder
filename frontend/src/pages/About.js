

const About = () => {
    return (
        <>
            <h3>About</h3>
            <p>
                This website was created by <a href="https://github.com/bowdens">@bowdens</a>.
            The github repository can be found <a href="https://github.com/bowdens/holder">here</a>.
            While the source code is open, the copyright is not (at least for now). Please do not copy or reproduce this website.
            </p>
            <h4>Roadmap</h4>
            <p>
                This software is still in development and there are several features I'd like to implement before I consider it done.
            </p>
            <ol>
                <li>
                    Better Error Messages - As of now, error messages are pretty sparse and often in basic alert()s, which isn't great for user experience. I want to make sure everything that can go wrong will have a useful error message to help the user resolve the error or so they can let me know of it.
                </li>
                <li>
                    Bag Passwords - Originally I was going to include bag passwords as part of the first release of the site, but it got cut so I could finish it quicker. Bag passwords will make it possible to ensure your bags are private. Passwords will be hashed and stored securely.
                </li>
                <li>
                    User Accounts - Again another feature that was going to be included but I cut. User accounts will allow for many more options for people to share their bags with only the people they want to, and enabling permissions for who can and can't edit bags and add items. This poses the challenge of storing personal data like email addresses and passwords however which I want to make sure I get right.
                </li>
                <li>
                    More SRD content - Right now the only SRD items that can be added to bags are the basic PHB equipment. That's because the equipment is all really simple. I want to add magic items to the list. Magic items have more complex descriptions including tables to roll on, which will need to be implemented so they can be viewed better.
                </li>
                <li>
                    Occupied Space - A new field which could be included in each item is how much space it occupies so users can get an estimate on how much space their bag has left. This would require me to estimate how much space each SRD item occupies if I want to include SRD items in this model.
                </li>
            </ol>
        </>
    );
}


export default About;